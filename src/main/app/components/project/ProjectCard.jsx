import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./projectcard.css";
import img from "./../../../../assets/SVG/up_img_1.svg";
import projectsSlice from "../../features/projects/projectsSlice";
import savedProjectsSlice from "../../features/projects/savedProjectsSlice";
import routerSlice from "../../features/router/routerSlice";
import { removeCover, uploadCover } from "../../../utils/upload";
import greberDB from "../../db/main";

import { ActiveBoardContext } from "../../App.jsx";
import { genID } from "../board/list/List.jsx";
import { getCoverPath } from "../../../utils/getAppData";
import { FiEdit, FiHeart, FiTrash } from "react-icons/fi";

export function editProject(new_project, dispatch) {
  let _new_project = {};

  for (let key in new_project) {
    if (key !== "_id") {
      _new_project[key] = new_project[key];
    }
  }
  new_project = _new_project;

  greberDB.databases.projects.update(
    { id: new_project.id },
    { $set: new_project },
    {},
    function (err, numReplaced) {
      if (!err) {
        let action = projectsSlice.actions.editProject(new_project);
        dispatch(action);
      } else {
        console.log(err);
      }
    }
  );
}
export default function ProjectCard(props) {
  let { infos } = props;
  let dispatch = useDispatch();
  let isSaved = useSelector(function (state) {
    for (let project of state.savedProjects) {
      if (project === infos.id) {
        return true;
      }
    }
    return false;
  });
  let project = infos;
  let { setActiveBoard } = useContext(ActiveBoardContext);

  return (
    <div className="project-card">
      {/* project editing disabled */}
      {/* onClick={
            async function () {
                // let _img = await uploadFile(`Change ${project.name} Background`,'image',true,['*.jpeg','*.jpg','*.png']);

                await removeCover(project.img);
                // generate a cover id
                const coverId = genID(10);
                let _img = await uploadCover(coverId)
                if (!_img.canceled)
                {
                    editProject({
                        ...project,
                        img: coverId
                    },dispatch);
                }
            }
        } */}
      <div className="project-img">
        <img src={getCoverPath(project.img) || img} alt="" />
        {/* <span><FiEdit /></span> */}
      </div>
      <div className="project-card-content">
        <div
          className="card-infos"
          onClick={function (e) {
            e.preventDefault();
            dispatch(projectsSlice.actions.setActiveProject(project));

            dispatch(routerSlice.actions.setActiveRouter("projectPage"));
            setActiveBoard({});
          }}
        >
          <h4 className="project-title">{project.name}</h4>
          <span className="project-desc">{project.desc}</span>
        </div>
        <div className="project-card-options">
          <span
            className={
              "project-card-option" +
              " " +
              (function () {
                if (isSaved) {
                  return "active-option";
                }
                return "";
              })()
            }
            onClick={function () {
              if (!isSaved) {
                greberDB.databases.savedProjects.insert(
                  {
                    project_id: infos.id,
                  },
                  function (err, numReplaced) {
                    if (!err) {
                      let action = savedProjectsSlice.actions.addSavedProject(
                        project.id
                      );
                      dispatch(action);
                    } else {
                      console.log(err);
                    }
                  }
                );
              } else {
                greberDB.databases.savedProjects.remove(
                  {
                    project_id: infos.id,
                  },
                  {},
                  function (err) {
                    if (!err) {
                      let action =
                        savedProjectsSlice.actions.removeSavedProject(
                          project.id
                        );
                      dispatch(action);
                    } else {
                      console.log(err);
                    }
                  }
                );
              }
            }}
          >
            <FiHeart />
          </span>

          <span
            className="project-card-option"
            onClick={function () {
              editProject(
                {
                  ...project,
                  removed: true,
                },
                dispatch
              );
            }}
          >
            <FiTrash />
          </span>
        </div>
      </div>
    </div>
  );
}
