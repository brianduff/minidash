#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execInDir } = require("./process_helper");
const launchctl = require("./launchctl");

const liveDir = path.join(os.homedir(), "minidash-deploy");

const installDir = fs.mkdtempSync(path.join(os.tmpdir(), "minidash-"));

// Clone from git.
execInDir(
  installDir,
  "git",
  "clone",
  "https://github.com/brianduff/minidash.git"
);
const minidashDir = path.join(installDir, "minidash");

// decrypt secrets.
const secretFile = path.join(os.homedir(), ".minidash-secret");
if (!fs.existsSync(secretFile)) {
  console.log(
    "WARNING: The secret file '%s' is missing. Unable to decrypt secrets",
    secretFile
  );
}

execInDir(minidashDir, "git-crypt", "unlock", secretFile);

// npm install.
execInDir(minidashDir, "npm", "install");

// build the optimized production build.
execInDir(minidashDir, "npm", "run-script", "build");

// Move the live version away to a tmpdir.
const oldDir = fs.mkdtempSync(path.join(os.tmpdir(), "minidash-"));
if (fs.existsSync(liveDir)) {
  fs.renameSync(liveDir, oldDir);
}
fs.renameSync(installDir, liveDir);

// Symlink the systemctl config file to the right place if it doesn't
// already exist, then reload and start the service.
launchctl.linkSystemCtl(liveDir);
launchctl.restartService();
