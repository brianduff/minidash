const fs = require("fs");
const os = require("os");
const path = require("path");
const process = require("process");
const { spawnSync } = require("child_process");

const liveDir = path.join(os.homedir(), "minidash-deploy");

const installDir = fs.mkdtempSync(path.join(os.tmpdir(), "minidash-"));

function exec(...args) {
  spawnSync(args[0], args.slice(1), {
    stdio: "inherit"
  });
}

function execInDir(dir, ...args) {
  spawnSync(args[0], args.slice(1), {
    stdio: "inherit",
    cwd: dir
  });
}

function getSystemCtl() {
  return process.platform == "darwin" ? "launchctl" : "systemctl";
}

// 1. Clone from git.
execInDir(
  installDir,
  "git",
  "clone",
  "https://github.com/brianduff/minidash.git"
);
const minidashDir = path.join(installDir, "minidash");

// 2. npm install.
execInDir(minidashDir, "npm", "install");

// 3. build the optimized production build.
execInDir(minidashDir, "npm", "run-script", "build");

// 4. stop the running instance. It's ok if this fails.
exec(getSystemCtl(), "stop", "minidash");

// 5. Move the live version away to a tmpdir.
const oldDir = fs.mkdtempSync(path.join(os.tmpdir(), "minidash-"));
if (fs.existsSync(liveDir)) {
  fs.renameSync(liveDir, oldDir);
}
fs.renameSync(installDir, liveDir);

// 6. Symlink the systemctl config file to the right place if it doesn't
//    already exist.
if (process.platform == "darwin") {
  const configFile = path.join(
    os.homedir(),
    "Library/LaunchAgents/org.dubh.minidash.plist"
  );
  if (!fs.existsSync(configFile)) {
    fs.linkSync(
      path.join(liveDir, "minidash/config/org.dubh.minidash.plist"),
      configFile
    );
  }
}

//spawnSync("systemctl", ["--user", "stop", "minidash"], {
//  stdio: "inherit"
//});

// 5. Move the live version away to a tmpdir

// 6. Move the new version in place

// 7. start back up
//spawnSync("systemctl", ["--user", "start", "minidash"], {
//  stdio: "inherit"
//});

// TODO(bduff): figure out how to get the systemctl file symlinked in the right place.
