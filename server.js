const bodyParser = require("body-parser");
const PMT_DB = require("./db-manager");
const express = require("express");

async function init(callback) {
  const app = express();
  const port = 5000;

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());

  // Load all databases
  await PMT_DB.readDatabases();

  // Database requests [READ MANY]
  app.post("/db/get", async (req, res) => {
    const { db, options } = req.body;
    const data = await PMT_DB.get(db, options);
    res.send(data);
  });

  // Database requests [READ ONE]
  app.post("/db/getone", async (req, res) => {
    const { db, options } = req.body;
    const data = await PMT_DB.getone(db, options);
    res.send(data);
  });

  // Database requests [INSERT]
  app.post("/db/insert", async (req, res) => {
    const { db, data } = req.body;
    const newData = await PMT_DB.insert(db, data);
    res.send(newData);
  });

  // Database requests [UPDATE]
  app.post("/db/update", async (req, res) => {
    const { db, data } = req.body;
    await PMT_DB.update(db, data);
    const updatedData = await PMT_DB.get(db, { filter: { id: data.id } });
    res.send(updatedData.length > 0 ? updatedData[0] : {});
  });

  // Database requests [DELETE]
  app.post("/db/delete", async (req, res) => {
    const { db, data } = req.body;
    const deleted = await PMT_DB.delete(db, data);
    res.send(deleted);
  });

  // Special database requests [GET]
  app.post("/db/get/search-object-inside-array", async (req, res) => {
    const { db, keyname, arg } = req.body;
    const data = await PMT_DB.get(db);
    let result = [];
    for (let d of data) {
      const matched = await PMT_DB.deepSearch(d[keyname], arg);
      if (matched.length > 0) {
        await result.push(d);
      }
    }
    res.send(result);
  });

  app.listen(port, callback);
}

module.exports = { init };
