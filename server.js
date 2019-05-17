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

app
  .prepare()
  .then(() => {
    const server = express()

    server.use(express.json());

    // Initializes (or resets) the db with some data
    server.get("/initdb", (req, res) => {
      var c = getOrCreateCollection("GoldCoins");
      c.insert({name:'michael', coins: 10});
      c.insert({name:'caitlin', coins: 40});
      res.send("OK")
    })

    server.get("/goldcoins/:name", (req, res) => {
      var c = getOrCreateCollection("GoldCoins")
      var record = c.find( {name: req.params.name})
      if (record.length == 0) {
        res.status(404).send("Not Found")
        return
      }
      delete record[0].meta
      delete record[0].$loki
      res.send(record[0])
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