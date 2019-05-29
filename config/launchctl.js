const fs = require("fs");
const os = require("os");
const path = require("path");
const process = require("process");
const { exec } = require("./process_helper");

const LINUX_CONFIG_DIR = ".config/systemd/user/";
const DARWIN_CONFIG_DIR = "Library/LaunchAgents/";
const LINUX_SERVICE = "minidash";
const LINUX_FILENAME = LINUX_SERVICE + ".service";
const DARWIN_SERVICE = "org.dubh.minidash";
const DARWIN_FILENAME = DARWIN_SERVICE + ".plist";

function getSystemCtl() {
  return process.platform == "darwin" ? "launchctl" : "systemctl";
}

function getConfigFile() {
  if (process.platform == "darwin") {
    return path.join(os.homedir(), DARWIN_CONFIG_DIR + DARWIN_FILENAME);
  }
  return path.join(os.homedir(), LINUX_CONFIG_DIR, LINUX_FILENAME);
}

function getServiceName() {
  if (process.platform == "darwin") {
    return DARWIN_SERVICE;
  }
  return LINUX_SERVICE;
}

exports.loadService = function() {
  if (process.platform == "darwin") {
    exec("launchctl", "unload", getConfigFile());
    exec("launchctl", "load", getConfigFile());
  } else {
    exec("systemctl", "--user", "daemon-reload");
  }
};

exports.stopService = function() {
  if (process.platform == "darwin") {
    exec(getSystemCtl(), "stop", getServiceName());
  } else {
    exec(getSystemCtl(), "--user", "stop", getServiceName());
  }
};

exports.startService = function() {
  if (process.platform == "darwin") {
    exec(getSystemCtl(), "start", getServiceName());
  } else {
    exec(getSystemCtl(), "--user", "start", getServiceName());
  }
};

exports.linkSystemCtl = function(liveDir) {
  let filename = LINUX_FILENAME;
  if (process.platform == "darwin") {
    filename = DARWIN_FILENAME;
  }
  if (!fs.existsSync(getConfigFile())) {
    fs.symlinkSync(
      path.join(liveDir, "minidash/config/" + filename),
      getConfigFile()
    );
  }
};
