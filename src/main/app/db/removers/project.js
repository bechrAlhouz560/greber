import store from "../../store";
import removeBoard from "./board";

import greberDB from "../main";
import projectsSlice from "../../features/projects/projectsSlice";
import { removeCover } from "../../../utils/upload";

export default function removeProject(project_id) {
  let project = store.getState().projects.projects.filter(function (project) {
    if (project.id === project_id) return project;
  })[0];

  return new Promise(function (resolve, reject) {
    let db = greberDB.databases.projects;
    db.remove(
      {
        id: project_id,
      },
      async function (err) {
        if (!err) {
          await removeCover(project.img);
          await removeBoards(project);
          store.dispatch(projectsSlice.actions.removeProject(project));

          resolve(project);
        } else {
          reject(err);
        }
      }
    );
  });
}
export async function removeBoards(project) {
  let boards = store.getState().boards.filter(function (board) {
    if (board.project_id === project.id) return project;
  });

  for await (let board of boards) {
    let db = greberDB.databases.boards;
    db.remove(
      {
        id: board.id,
      },
      async function (err) {
        if (!err) {
          await removeBoard(board.id);
        }
      }
    );
  }
}
