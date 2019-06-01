const FitbitApiClient = require("fitbit-node");
const fs = require("fs");
const redis = require("redis");
const { promisify } = require("util");

const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const zaddAsync = promisify(redisClient.zadd).bind(redisClient);
const zrangeAsync = promisify(redisClient.zrange).bind(redisClient);

redisClient.on("error", function(err) {
  console.log("Redis Error: %s", err);
});

let client = undefined;

function getCallbackUrl() {
  // Hack hack
  let username = require("os").userInfo().username;
  if ("minidash" == username) {
    // Running in production
    return "https://minidash.dubh.org/fitbit/authcallback";
  } else {
    // Running on a local dev machine
    return "http://localhost:8080/fitbit/authcallback";
  }
}

function authorize(req, res) {
  res.redirect(client.getAuthorizeUrl("weight", getCallbackUrl()));
}

function _storeAccessTokens(tokens) {
  redisClient.set("minidash.fitbit.accessToken", tokens.access_token);
  redisClient.set("minidash.fitbit.refreshToken", tokens.refresh_token);
}

function authCallback(req, res) {
  client
    .getAccessToken(req.query.code, getCallbackUrl())
    .then(result => {
      _storeAccessTokens(result);
      res.send("OK");
    })
    .catch(err => {
      res.status(err.status).send(err);
    });
}

async function _getWeightImpl(accessToken) {
  return await client.get(
    "/body/log/weight/date/2019-05-30/1m.json",
    accessToken,
    null,
    {
      "Accept-Language": "en_US"
    }
  );
}

function _hasExpiredTokenError(results) {
  if (results[0] && results[0].errors) {
    for (let error of results[0].errors) {
      if (error.errorType == "expired_token") {
        return true;
      }
    }
  }
  return false;
}

async function getWeight(req, res) {
  let accessToken = await getAsync("minidash.fitbit.accessToken");
  let results = await _getWeightImpl(accessToken);

  console.log("Requesting weight");
  if (_hasExpiredTokenError(results)) {
    let refreshToken = await getAsync("minidash.fitbit.refreshToken");
    console.log(
      "Fitbit access token exired. Refreshing.",
      accessToken,
      refreshToken
    );
    try {
      let tokens = await client.refreshAccessToken(accessToken, refreshToken);
      _storeAccessTokens(tokens);
      accessToken = tokens.access_token;
      results = await _getWeightImpl(accessToken);
    } catch (err) {
      // Refreshing the token was rejected. We have to re-auth.
      authorize(req, res);
      return;

      // This is an ugly mess :()
    }
  }

  if (res != null) {
    res.send(results[0]);
  }

  // Push the results into redis
  for (let i = 0; i < results[0].weight.length; i++) {
    let weight = results[0].weight[i];
    let date = weight.date;
    let time = weight.time; // device time (sigh)

    let timestamp = new Date(date + " " + time).getTime();

    await zaddAsync("minidash.fitbit.weight", timestamp, weight.weight);
    await zaddAsync("minidash.fitbit.bmi", timestamp, weight.bmi);
    await zaddAsync("minidash.fitbit.fat", timestamp, weight.fat);
  }
}

async function getData(req, res) {
  let result = await zrangeAsync(
    "minidash.fitbit." + req.params.dataset,
    0,
    -1,
    "withscores"
  );
  let resultArray = [];
  for (let i = 0; i < result.length; i += 2) {
    resultArray.push({
      time: result[i + 1],
      data: result[i]
    });
  }
  res.send(resultArray);

  // This is a bit weird, but schedule an update from fitbit so data is fresh
  // next time.
  getWeight();
}

// Installs support for fitbit related URLs into the express server
exports.install = function(server) {
  server.get("/fitbit/authorize", authorize);
  server.get("/fitbit/authcallback", authCallback);
  server.get("/fitbit/test", getWeight);
  server.get("/fitbit/:dataset", getData);

  let rawdata = fs.readFileSync("secrets/fitbit.json");
  let fitbitSecrets = JSON.parse(rawdata);

  client = new FitbitApiClient({
    clientId: fitbitSecrets.id,
    clientSecret: fitbitSecrets.secret
  });
};
