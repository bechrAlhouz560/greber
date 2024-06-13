import React, { useState, useContext } from "react";
import "./createproject-modal.css";
import img from "./../../../../assets/SVG/up_img_1.svg";
import { useDispatch, useSelector, useStore } from "react-redux";
import projectsSlice from "../../features/projects/projectsSlice";
import routerSlice from "../../features/router/routerSlice";
import uploadFile, { uploadCover } from "../../../utils/upload";
import greberDB from "../../db/main";
import { ActiveBoardContext, ErrorContext } from "../../App.jsx";
import { genID } from "../board/list/List.jsx";
import { FiPlus } from "react-icons/fi";

export function ModalContainer(props) {
  const { setModalActive, children } = props;

  return (
    <div
      className="modal-container"
      onClick={function (e) {
        if (e.target.className === e.currentTarget.className) {
          setModalActive(false);
        }
      }}
    >
      {children}
    </div>
  );
}
export default function CreateProjectModal(props) {
  // STATES
  const { setModalActive } = props;
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectImg, setProjectImg] = useState(img);
  const dispatch = useDispatch();
  // SELECTORS
  const projects = useSelector(function (state) {
    return state.projects.projects;
  });
  const { activeBoard, setActiveBoard } = useContext(ActiveBoardContext);
  const { _, setError } = useContext(ErrorContext);
  function projectExists() {
    const exists = projects.filter(function (value) {
      if (value.name === projectName) {
        return value;
      }
    });
    if (exists.length > 0) {
      return true;
    }
    return false;
  }
  function isDisabled() {
    if (projectDesc === "" && projectName === "") {
      return true;
    } else {
      return false;
    }
  }
  return (
    <ModalContainer setModalActive={setModalActive}>
      <div className="modal project-modal ">
        <div className="project-infos">
          <h1 className="title">
            <FiPlus /> Create Project
          </h1>
          <span className="desc">
            Start your project plan to arrange your work
          </span>

          <div className="project-inputs">
            <div className="project-input">
              <div className="project-label">
                <span>Project name</span>
              </div>
              <input
                type="text"
                onPaste={function (e) {
                  e.preventDefault();
                  let value = e.clipboardData.getData("text/plain");
                  setProjectName(value.substring(0, 50));
                }}
                value={projectName}
                className="g-input"
                onChange={function (e) {
                  let value = e.currentTarget.value;
                  if (value.length <= 50) {
                    setProjectName(value);
                  }
                }}
              />
            </div>
            <div className="project-input">
              <div className="project-label">
                <span>Project description (Optional)</span>
              </div>
              <textarea
                value={projectDesc}
                className="g-input"
                onPaste={function (e) {
                  e.preventDefault();
                  let value = e.clipboardData.getData("text/plain");
                  setProjectDesc(value.substring(0, 200));
                }}
                onChange={function (e) {
                  let value = e.currentTarget.value;
                  if (value.length <= 300) {
                    setProjectDesc(value);
                  }
                }}
              />
            </div>
            <div className="project-input ">
              <button
                className="g-btn g-btn-rounded"
                disabled={isDisabled()}
                onClick={function () {
                  if (!isDisabled()) {
                    if (!projectExists()) {
                      let coverId = genID(10);
                      uploadCover(coverId, projectImg).catch(function (err) {
                        console.log(err);
                      });
                      let project = {
                        id: genID(10),
                        name: projectName,
                        desc: projectDesc,
                        img: coverId,
                        queue: projects.length + 1,
                        created_at: new Date(),
                      };

                      greberDB.databases["projects"].insert(
                        project,
                        function (err, doc) {
                          if (!err) {
                            dispatch(projectsSlice.actions.addProject(project));
                            dispatch(
                              projectsSlice.actions.setActiveProject(project)
                            );

                            dispatch(
                              routerSlice.actions.setActiveRouter("projectPage")
                            );
                            setModalActive(false);
                            setActiveBoard({});
                          }
                        }
                      );
                    } else {
                      setError({
                        title: "Error",
                        message: "This project already exists",
                      });
                    }
                  }
                }}
              >
                <span>Continue</span>
              </button>
            </div>
            <div className="project-input">
              <div
                className="g-btn g-btn-rounded g-btn-danger"
                onClick={function () {
                  setModalActive(false);
                }}
              >
                <span>Discard</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className="project-img"
          onClick={async function () {
            let project_img = await uploadFile(
              "Add photo to your img",
              "image",
              false
            );
            setProjectImg(project_img);
          }}
        >
          <img src={projectImg} alt="" />
        </div>
      </div>
    </ModalContainer>
  );
}
