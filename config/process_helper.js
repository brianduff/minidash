const { spawnSync } = require("child_process");

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
