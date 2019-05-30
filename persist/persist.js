const loki = require("lokijs");
const os = require("os");
const path = require("path");

class Persist {
  constructor(identifier) {
    this.identifier = identifier;

    const dbFilePath = path.join(
      os.homedir(),
      ".minidash-" + identifier + ".json"
    );

    this.db = new loki(dbFilePath, {
      autosave: true,
      autosaveInterval: 5000,
      autoload: true
    });
  }

  _getOrCreateCollection(collectionId) {
    let col = this.db.getCollection(collectionId);
    if (col == null) {
      col = this.db.addCollection(collectionId);
    }
    return col;
  }

  _fetchSingleRecord(collectionId, searchParams) {
    let c = this._getOrCreateCollection(collectionId);
    let record = c.find(searchParams);
    if (record.length == 0) {
      return null;
    }
    delete record[0].meta;
    delete record[0].$loki;
    return record[0];
  }

  putRecord(collectionId, record) {
    let col = this._getOrCreateCollection(collectionId);
    col.insert(record);
  }

  getRecord(collectionId, searchParams) {
    return this._fetchSingleRecord(collectionId, searchParams);
  }

  getOnlyRecord(collectionId) {
    return this._getOrCreateCollection(collectionId).get(1);
  }
}

exports.Persist = Persist;
