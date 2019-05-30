const FitbitApiClient = require("fitbit-node");
const fs = require("fs");
const CALLBACK_URL = "http://localhost:8080/fitbit/authcallback";

let client = undefined;

function authorize(req, res) {
  res.redirect(client.getAuthorizeUrl("weight", CALLBACK_URL));
}

function authCallback(req, res) {
  client
    .getAccessToken(req.query.code, CALLBACK_URL)
    .then(result => {
      d;
      console.log("Access token: %s", result.access_token);
      console.log("Refresh token: %s", result.refresh_token);
      res.send("OK");
    })
    .catch(err => {
      res.status(err.status).send(err);
    });
}

// Installs support for fitbit related URLs into the express server
exports.install = function(server) {
  server.get("/fitbit/authorize", authorize);
  server.get("/fitbit/authcallback", authCallback);

  let rawdata = fs.readFileSync("secrets/fitbit.json");
  let fitbitSecrets = JSON.parse(rawdata);

  client = new FitbitApiClient({
    clientId: fitbitSecrets.id,
    clientSecret: fitbitSecrets.secret
  });
};
