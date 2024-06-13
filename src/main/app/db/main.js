//  initializing the Greber Database

import getAppData from "../../utils/getAppData";
import store from "../store";
import Nedb from "nedb";
import path from "path";

const greberDB = {
  db_path: getAppData() + "/databases",
  databases: {},
  db_names: [
    "projects",
    "boards",
    "savedProjects",
    "recentProjects",
    "lists",
    "cards",
    "cardActivity",
    "cardChecklists",
    "checklistItems",
    "cardLabels",
    "events",
  ],

  // load databases with autoload
  createDb: function () {
    for (const dbname of greberDB.db_names) {
      const dist = path.resolve(greberDB.db_path, `${dbname}.db`);
      greberDB.databases[dbname] = new Nedb({
        filename: dist,
        autoload: true,
      });
    }
  },

  // with out autoload

  loadDb: async function (dbname) {
    return new Promise(function (resolve, reject) {
      const db = new Nedb({
        filename: path.resolve(greberDB.db_path, `${dbname}.db`),
      });

      db.loadDatabase(function (err) {
        console.log(dbname, "loaded");
        !err ? resolve(db) : reject(err);
      });
    });
  },
  init: async function () {
    // this.databases = {
    //   projects: new Nedb({
    //     filename: greberDB.db_path + "/projects.db",
    //     autoload: true,
    //   }),
    //   boards: new Nedb({
    //     filename: greberDB.db_path + "/boards.db",
    //     autoload: true,
    //   }),
    //   savedProjects: new Nedb({
    //     filename: greberDB.db_path + "/savedProjects.db",
    //     autoload: true,
    //   }),
    //   recentProjects: new Nedb({
    //     filename: greberDB.db_path + "/recentProjects.db",
    //     autoload: true,
    //   }),

    //   lists: new Nedb({
    //     filename: greberDB.db_path + "/lists.db",
    //     autoload: true,
    //   }),
    //   cards: new Nedb({
    //     filename: greberDB.db_path + "/cards.db",
    //     autoload: true,
    //   }),
    //   cardActivity: new Nedb({
    //     filename: greberDB.db_path + "/cardActivity.db",
    //     autoload: true,
    //   }),
    //   cardChecklists: new Nedb({
    //     filename: greberDB.db_path + "/cardChecklists.db",
    //     autoload: true,
    //   }),
    //   checklistItems: new Nedb({
    //     filename: greberDB.db_path + "/checklistItems.db",
    //     autoload: true,
    //   }),
    //   recentProjects: new Nedb({
    //     filename: greberDB.db_path + "/recentProjects.db",
    //     autoload: true,
    //   }),
    //   cardLabels: new Nedb({
    //     filename: greberDB.db_path + "/cardLabels.db",
    //     autoload: true,
    //   }),
    //   events: new Nedb({
    //     filename: greberDB.db_path + "/events.db",
    //     autoload: true,
    //   }),

    //   //
    // };

    for (let db_name of greberDB.db_names) {
      const db = await this.loadDb(db_name);

      this.databases[db_name] = db;
      let data = await this.findAll(db_name);
      store.dispatch({
        type: `${db_name}/init`,
        payload: data,
      });
    }
  },
  findAll: function (db_name) {
    return new Promise(function (resolve, reject) {
      let db = greberDB.databases[db_name];

      db.find({}, function (err, doc) {
        if (!err) {
          resolve(doc);
        } else {
          reject(err);
        }
      });
    });
  },
  clearDb: function () {
    return new Promise(function (resolve, reject) {
      let finished = 0;

      for (let db in greberDB.databases) {
        greberDB.databases[db].remove(
          {},
          {
            multi: true,
          },
          function (err) {
            if (err) {
              console.error(err);

              reject(err);
            }

            finished += 1;

            if (finished === 10) {
              resolve();
            }
          }
        );
      }
    });
  },

  restore: (data) => {
    return new Promise(function (resolve, reject) {
      greberDB.clearDb().then(function () {
        let finished = 0;
        for (let dbname in greberDB.databases) {
          let db = greberDB.databases[dbname];

          db.insert(
            dbname !== "projects"
              ? data[dbname]
              : data[dbname]
                  .projects /* special cased for projects database  */,
            function (err) {
              if (!err) {
                console.log("importing to ", dbname, "...");
                store.dispatch({
                  type: `${dbname}/init`,
                  payload: data[dbname],
                });
                finished += 1;

                if (finished === 10) {
                  resolve();
                }
              } else {
                reject(err);
              }
            }
          );
        }
      });
    });
  },
};

export default greberDB;
