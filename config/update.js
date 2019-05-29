const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const folder = fs.mkdtempSync(path.join(os.tmpdir(), "minidash-"));

// 1. Clone from git.
spawnSync("git", ["clone", "https://github.com/brianduff/minidash.git"], {
  cwd: folder,
  stdio: "inherit"
});

// 2. npm install.
spawnSync("npm", ["install"], {
  cwd: path.join(folder, "minidash"),
  stdio: "inherit"
});

// 3. build the optimized production build.
spawnSync("npm", ["run-script", "build"], {
  cwd: path.join(folder, "minidash"),
  stdio: "inherit"
});

// 4. stop the running instance.
spawnSync("systemctl", ["--user", "stop", "minidash"], {
  stdio: "inherit"
});

// 5. Move the live version away to a tmpdir

// 6. Move the new version in place

// 7. start back up
spawnSync("systemctl", ["--user", "start", "minidash"], {
  stdio: "inherit"
});

// TODO(bduff): figure out how to get the systemctl file symlinked in the right place.
