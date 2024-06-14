import styles from "./project.module.css";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Board from "../board/Board.jsx";
import CreateBoardModal from "../modals/CreateBoardModal.jsx";
import CardEditor from "../board/card/CardEditor.jsx";
import boardsSlice from "../../features/boards/boardsSlice";
import { editProject } from "./ProjectCard.jsx";
import { ActiveBoardContext } from "../../App.jsx";
import db from "../../db/main";
import { unlink } from "fs";
import { promisify } from "util";
import { getCoverPath } from "../../../utils/getAppData";
import { genID } from "../board/list/List.jsx";
import { removeCover, uploadCover } from "../../../utils/upload";
import { recentProjectsSlice } from "../../features/projects/projectsSlice";
import greberDB from "../../db/main";
import {
  FiArrowLeft,
  FiArrowRight,
  FiPlus,
  FiPlusSquare,
  FiTrash,
} from "react-icons/fi";
import { MdEdit } from "react-icons/md";

// Secondary Components
export function BoardButton(props) {
  const { board, setActiveBoard, activeBoard } = props;

  const _board = useSelector(function (state) {
    return state.boards.filter(function (__board) {
      if (board.id === __board.id) {
        return __board;
      }
    });
  })[0];

  const dispatch = useDispatch();
  return (
    <div
      className={styles["board-btn"]}
      style={{
        borderLeft: "5px solid " + _board.background,
        background: _board.id === activeBoard.id ? _board.background : "white",
        color: _board.id === activeBoard.id ? "white" : "var(--theme1-blue)",

        // color:"white"
      }}
    >
      <span
        onClick={function () {
          setActiveBoard(board);
        }}
      >
        {board.name}
      </span>

      <div
        className={styles["del-board"]}
        onClick={async function () {
          let newBoard = {
            ..._board,
            removed: true,
          };
          db.databases.boards.update(
            { id: newBoard.id },
            { $set: newBoard },
            {},
            function (err) {
              if (!err) {
                dispatch(boardsSlice.actions.editBoard(newBoard));
                if (_board.id === activeBoard.id) {
                  setActiveBoard({});
                }
              } else {
                console.log(err);
              }
            }
          );
        }}
      >
        <FiTrash />
      </div>
    </div>
  );
}

export function BoardsContainer(props) {
  const { children, setModalActive } = props;
  return (
    <div className={styles["boards-container"]}>
      <div className={styles["header"]}>
        <div className={styles["header-title"]}>Your Boards</div>
        {/* <div className={styles["add-board"]} onClick= {
                function () {
                    setModalActive(true);
                }
            }><FiPlus /></div> */}
      </div>
      <div className={styles["boards"]}>{children}</div>
    </div>
  );
}

export function ProjectHome(props) {
  let dispatch = useDispatch();
  useEffect(function () {
    dispatch({
      type: "cardEditor/setInActive",
    });
  }, []);
  return (
    <div className={styles["project-home"]}>
      <h1>
        <FiPlusSquare
          style={{
            fontSize: "100px",
          }}
        />{" "}
        <br /> Select or create a Board <br /> to start
      </h1>
    </div>
  );
}

// Main Component
export default function Project(props) {
  // selectors
  let active = useSelector(function (state) {
    return state.projects.activeProject;
  });
  let project = useSelector(function (state) {
    for (const _project of state.projects.projects) {
      if (active.id === _project.id) {
        return _project;
      }
    }
  });
  let projectBoards = useSelector(function (state) {
    return state.boards
      .filter(function (board) {
        if (project.id === board.project_id && !board.removed) {
          return board;
        }
      })
      .sort((a, b) => a.queue - b.queue);
  });
  let cardEditorActive = useSelector(function (state) {
    return state.cardEditor;
  });
  let dispatch = useDispatch();
  // States
  let { activeBoard, setActiveBoard } = useContext(ActiveBoardContext);
  let [modalActive, setModalActive] = useState(false);
  let [sideBarHidden, setSideBarHidden] = useState(false);

  useEffect(function () {
    // add to recent opened projects

    greberDB.databases.recentProjects.insert(
      {
        project_id: project.id,
      },
      function (err) {
        if (!err) {
          const action = recentProjectsSlice.actions.addRecentProject(
            project.id
          );
          dispatch(action);

          editProject(
            {
              ...project,
              lastOpened: new Date(),
            },
            dispatch
          );
        } else {
          console.log(err);
        }
      }
    );
  }, []);

  return (
    <div className={styles["project-page"]}>
      <div
        className={styles["project-side-bar"]}
        style={{
          display: sideBarHidden ? "none" : "flex",
        }}
      >
        <div className={styles["project-img"]}>
          <img src={getCoverPath(project.img)} alt="" />

          <div
            className="bg-edit-btn"
            onClick={async function () {
              // generate a cover id
              const coverId = genID(10);

              await removeCover(project.img);
              let _img = await uploadCover(coverId);

              if (!_img.canceled) {
                editProject(
                  {
                    ...project,
                    img: coverId,
                  },
                  dispatch
                );
              }
            }}
          >
            <MdEdit />
          </div>
        </div>
        <div className={styles["project-title"]}>
          <span>{project.name}</span>
        </div>
        <div className={styles["project-desc"]}>
          <p>{project.desc}</p>
        </div>
        <div className={styles["project-items"]}>
          <BoardsContainer project={project} setModalActive={setModalActive}>
            {projectBoards.map(function (board, index) {
              return (
                <BoardButton
                  key={index}
                  board={board}
                  setActiveBoard={setActiveBoard}
                  activeBoard={activeBoard}
                />
              );
            })}
          </BoardsContainer>

          <div
            className="add-list"
            onClick={function () {
              setModalActive(true);
            }}
            style={{
              height: 35,
              padding: 0,
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "white",
              boxShadow: "none",
            }}
          >
            <span>
              <FiPlus />
            </span>
          </div>
        </div>
      </div>
      <div className={styles["project-body"]}>
        {(function () {
          if (modalActive) {
            return (
              <CreateBoardModal
                project={project}
                setModalActive={setModalActive}
              />
            );
          }
        })()}
        {(function () {
          if (activeBoard.name) {
            return <Board board={activeBoard} />;
          }
          return <ProjectHome project={project} />;
        })()}
        <div
          className={styles["toggler"]}
          onClick={function () {
            setSideBarHidden(!sideBarHidden);
          }}
          style={{
            left: sideBarHidden ? "10px" : "280px",
          }}
        >
          {sideBarHidden ? <FiArrowRight /> : <FiArrowLeft />}
        </div>
        {cardEditorActive.name ? <CardEditor card={cardEditorActive} /> : ""}
      </div>
    </div>
  );
}
