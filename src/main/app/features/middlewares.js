import greberDB from "../db/main";
import { recentProjectsSlice } from "./projects/projectsSlice";
const middlewares = [
  // redux middlewares
  (store) => (next) => (action) => {
    const type = action.type;
    if (type === "projects/setActiveProject") {
      const project = action.payload;
      const db = greberDB.databases["recentProjects"];

      db.findOne({ project_id: project.id }, function (err, doc) {
        if (!err && !doc) {
          db.insert(
            {
              project_id: project.id,
              created_at: new Date(),
            },
            function (err, doc) {
              if (!err) {
                const act = recentProjectsSlice.actions.addRecentProject(
                  doc.project_id
                );

                store.dispatch(act);
              }
            }
          );
        }
      });
    }
    return next(action); // pass the action on to the next middleware in the pipeline
  },
];
export default middlewares;
