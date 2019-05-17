const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


const loki = require("lokijs")
const db = new loki("loki.json", {autosave: true, autosaveInterval: 5000, autoload: true});

function getOrCreateCollection(collectionName) {
  var col = db.getCollection(collectionName);
  if (col == null) {
    col = db.addCollection(collectionName);
  }
  return col;
}

function fetchSingleRecord(collectionName, searchParams) {
  var c = getOrCreateCollection(collectionName);
  var record = c.find(searchParams);
  if (record.length == 0) {
    return null;
  }
  delete record[0].meta;
  delete record[0].$loki;
  return record[0];
}

app
  .prepare()
  .then(() => {
    const server = express()

    server.use(express.json());

    // Initializes (or resets) the db with some data
    server.get("/initdb", (req, res) => {
      var coins = getOrCreateCollection("GoldCoins");
      coins.insert({name:'michael', coins: 10});
      coins.insert({name:'caitlin', coins: 40});

      var dates = getOrCreateCollection("Dates");
      dates.insert({name:"lastChipDay", value: "2019-05-10"});

      res.send("OK")
    })

    server.get("/dates/:name", (req, res) => {
      var record = fetchSingleRecord("Dates", {name: req.params.name});
      if (record == null) {
        res.status(404).send("Not Found");
        return;
      }
      res.send(record);
    })

    server.get("/goldcoins/:name", (req, res) => {
      var record = fetchSingleRecord("GoldCoins", {name: req.params.name});
      if (record == null) {
        res.status(404).send("Not Found");
        return;
      }
      res.send(record);
    })

    server.get('/test', (req, res) => {
      console.log("Hello")
      return res.json({ hello: "world" })
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(3000, err => {
      if (err) throw err
      console.log("Ready on port 3000")
    })
  })
  .catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })