const { spawnSync, execSync } = require("child_process");

exports.exec = function(...args) {
  spawnSync(args[0], args.slice(1), {
    stdio: "inherit"
  });
};

exports.execInDir = function(dir, ...args) {
  spawnSync(args[0], args.slice(1), {
    stdio: "inherit",
    cwd: dir
  });
};

exports.execInShell = function(...args) {
  execSync(args[0], args.slice(1), {
    stdio: "inherit"
  });
};
