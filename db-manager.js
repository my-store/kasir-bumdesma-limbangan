const { writeFileSync, readFileSync, existsSync, mkdirSync } = require("fs");
const { v7: uuidv7 } = require("uuid");
const { join, sep } = require("path");
const { globSync } = require("glob");
const DbPath = join(__dirname, "databases");

class DatabaseManajer {
  Data = {};
  fext = ".json";

  // This method is called whenever app is closed
  async writeChange(db = "*") {
    let databases = Object.keys(this.Data);

    // Single database update
    if (db != "*") {
      // Filter only changed database
      databases = await databases.filter((d) => d == db);
    }

    // Execute command to modify database file
    for (let dbname of databases) {
      try {
        await writeFileSync(
          join(DbPath, dbname.replace(/\./g, "\\") + this.fext),
          JSON.stringify(this.Data[dbname])
        );
      } catch (error) {
        throw error;
      }
    }
  }

  async insert(table, data) {
    if (this.Data[table] && data) {
      // Automatic add ID if not presented
      if (!data.id) {
        data.id = await uuidv7().replace(/\-/g, "");
        // Checking, if new ID have been used
        const matched = await this.Data[table].find((d) => d.id == data.id);
        // ID is being used, recall this method
        if (matched) {
          // Delete first generated ID from data
          delete data.id;
          // Recall this method
          return this.insert(table, data);
        }
      }
      await this.Data[table].push(data);
      await this.writeChange(table);
      return data;
    }
  }

  async update(table, data) {
    if (this.Data[table] && data.id) {
      const matched = this.Data[table].find((d) => d.id == data.id);
      if (matched) {
        const matchedIndex = this.Data[table].indexOf(matched);
        this.Data[table][matchedIndex] = { ...matched, ...data };
        await this.writeChange(table);
      }
    }
  }

  async delete(table, data) {
    if (this.Data[table] && data.id) {
      const matched = this.Data[table].find((d) => d.id == data.id);
      if (matched) {
        const matchedIndex = this.Data[table].indexOf(matched);
        this.Data[table].splice(matchedIndex, 1);
        await this.writeChange(table);
        return matched;
      }
    }
  }

  async getone(table, by) {
    const k = Object.keys(by)[0];
    const v = Object.values(by)[0];
    const data = await this.Data[table].find((d) => d[k] == v);
    return data;
  }

  deepSearch(data, filter) {
    let result = [];
    function deep(obj1, obj2) {
      let matchTest = false;

      // Object value between source and arg
      if (typeof obj1 == "object" && typeof obj2 == "object") {
        // Recall deep() function
        matchTest = Object.keys(obj1).every(
          (k) => obj2.hasOwnProperty(k) && deep(obj1[k], obj2[k])
        );
      }

      // Deep search method
      // Make sure the argument is object
      if (typeof obj1 == "object") {
        // $contain = The value is contained some letter or words
        const $contain = Object.keys(obj1).find((k) => k == "$contain");
        if ($contain) {
          const containKey = obj1[$contain];
          //   Make sure match-key is not empty
          if (containKey.length > 0) {
            const containKeyMatch = obj2.match(new RegExp(containKey, "gi"));
            // The value is contain the words
            if (containKeyMatch) {
              matchTest = true;
            }
          }
        }
        // $lt = The value is less-than
        const $lt = Object.keys(obj1).find((k) => k == "$lt");
        if ($lt) {
          matchTest = obj2 < obj1[$lt];
        }
        // $lte = The value is less-than-equal
        const $lte = Object.keys(obj1).find((k) => k == "$lte");
        if ($lte) {
          matchTest = obj2 <= obj1[$lte];
        }
        // $gt = The value is grather-than
        const $gt = Object.keys(obj1).find((k) => k == "$gt");
        if ($gt) {
          matchTest = obj2 > obj1[$gt];
        }
        // $gte = The value is grather-than-equal
        const $gte = Object.keys(obj1).find((k) => k == "$gte");
        if ($gte) {
          matchTest = obj2 >= obj1[$gte];
        }
      }

      // String or number value
      else {
        matchTest = obj1 == obj2;
      }

      return matchTest;
    }

    for (let d of data) {
      const matched = Object.keys(filter).every(
        (k) => d.hasOwnProperty(k) && deep(filter[k], d[k])
      );
      if (matched) {
        result.push(d);
      }
    }

    return result;
  }

  async get(table, options) {
    let data = [];
    try {
      data = this.Data[table];

      // Any arguments
      if (options) {
        // Filter
        if (options.filter) {
          data = await this.deepSearch(data, options.filter);
        }

        // Order
        if (options.order && options.order == "DESC") {
          data.reverse();
        }

        // Limit
        if (options.take) {
          data = data.slice(0, options.take);
        }
      }
    } catch (error) {}

    return data;
  }

  async readDatabases() {
    const globPattern = join(DbPath) + `/**/*${this.fext}`;
    const files = await globSync(globPattern, { windowsPathsNoEscape: true });
    for (let f of files) {
      const data = await readFileSync(f);
      const fname = f
        .split("databases" + sep)
        .pop()
        .replace(sep, ".")
        .split(this.fext)[0];
      this.Data[fname] = JSON.parse(data);
    }

    // For testing ...
    // --- Right here
  }

  async prepareDefaultDatabase() {
    const dbPathExists = await existsSync(DbPath);
    if (!dbPathExists) {
      await mkdirSync(DbPath);
    }
    const jsonDb = await readFileSync(join(__dirname, "db-default-data.json"));
    const jsonData = JSON.parse(jsonDb);
    for (let d of jsonData) {
      const { name, data } = d;
      // Multiple database
      if (name.match(/\./gi)) {
        const nestedDirName = name.split(/\./gi)[0];
        const nestedFileName = name.split(/\./gi).pop();
        const nestedDirPath = join(DbPath, nestedDirName);
        const nestedDirExists = await existsSync(nestedDirPath);
        // Nested directory is not exists
        if (!nestedDirExists) {
          // Create a new nested directory
          await mkdirSync(nestedDirPath);
        }
        // Create a database file
        await writeFileSync(
          join(nestedDirPath, nestedFileName + this.fext),
          JSON.stringify(data)
        );
      }
      // Single database
      else {
        const dbFile = join(DbPath, name + this.fext);
        const dbExists = await existsSync(dbFile);
        if (!dbExists) {
          await writeFileSync(dbFile, JSON.stringify(data));
        }
      }
    }
  }
}

const initDB = new DatabaseManajer();
// initDB.prepareDefaultDatabase(); // For testing ...
// initDB.readDatabases(); // For testing ...
module.exports = initDB;
