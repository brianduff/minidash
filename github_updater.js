const { execInShell } = require("./config/process_helper");
const os = require("os");
const path = require("path");

exports.onPush = function(req, res) {
  const event = req.header("X-Github-Event");
  const signature = req.header("X-Hub-Signature");

  if (event == "push") {
    console.log("Push from github detected. Redeploying");
    execInShell(
      path.join(os.homedir(), "minidash-deploy/minidash/config/update.js")
    );
  } else {
    console.log("Unknown github event: %s", event);
  }

  res.send("OK");
};
