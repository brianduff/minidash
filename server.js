const express = require("express");
const next = require("next");
const os = require("os");
const path = require("path");
const fs = require("fs");
const github = require("./github_updater");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const persist = require("./persist/persist");
const fitbit = require("./fitbit/fitbit");
const args = require("commander");

const db = new persist.Persist("trinket");

args
  .version("1.0")
  .option("-p, --port <n>", "Port number", 8080)
  .parse(process.argv);

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(express.json());
    server.use(express.static("static"));

    fitbit.install(server);

    // Initializes (or resets) the db with some data
    server.get("/initdb", (req, res) => {
      db.putRecord("GoldCoins", { name: "michael", coins: 10 });
      db.putRecord("GoldCoins", { name: "caitlin", coins: 40 });

      db.putRecord("Dates", { name: "lastChipDay", value: "2019-05-10" });

      res.send("OK");
    });

    server.get("/dates/:name", (req, res) => {
      var record = db.getRecord("Dates", { name: req.params.name });
      if (record == null) {
        res.status(404).send("Not Found");
        return;
      }
      res.send(record);
    });

    server.get("/goldcoins/:name", (req, res) => {
      var record = db.getRecord("GoldCoins", { name: req.params.name });
      if (record == null) {
        res.status(404).send("Not Found");
        return;
      }
      res.send(record);
    });

    server.get("/test", (req, res) => {
      console.log("Hello");
      return res.json({ hello: "world" });
    });

    // Github web hook!
    server.post("/github", github.onPush);

    server.get("/versioninfo", (req, res) => {
      let sha = fs.readFileSync(".git/refs/heads/master", "utf8");
      return res.json({
        commit: sha.trim()
      });
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(args.port, err => {
      if (err) throw err;
      console.log("Ready on port %s", args.port);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
