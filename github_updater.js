exports.onPush = function(req, res) {
  const event = req.header("X-Github-Event");
  const signature = req.header("X-Hub-Signature");

  if (event == "push") {
    console.log("Push from github detected. Redeploying");
  } else {
    console.log("Unknown github event: %s", event);
  }

  res.send("OK");
};
