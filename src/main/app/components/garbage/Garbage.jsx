import React, { useContext, useState } from "react";
import styles from "./garbage.module.css";
import { useDispatch, useSelector } from "react-redux";
import Project from "../project/ProjectCard.jsx";
import projectsSlice from "../../features/projects/projectsSlice";
import db from "../../db/main";
import { ErrorContext } from "../../App.jsx";
import boardsSlice from "../../features/boards/boardsSlice";
import removeBoard, { removeList } from "../../db/removers/board";
import List, { editList } from "../board/list/List.jsx";
import store from "../../store";
import removeProject from "../../db/removers/project";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { FiClipboard, FiFolder, FiList, FiTrash } from "react-icons/fi";

// garbage item containers (pure components to avoid unnecessary renders)
export function BoardCardContainer({ board, restore, remove, loading }) {
  return (
    <GarbageItemWrapper restore={restore} remove={remove} loading={loading}>
      <div
        className={styles["board-card"]}
        style={{
          background: board.background,
        }}
      >
        <h3>{board.name}</h3>
        <span>{board.desc}</span>
      </div>
    </GarbageItemWrapper>
  );
}

export function ListContainer({ list }) {
  let [loading, setLoading] = useState(false);
  function restoreList() {
    let newList = { ...list, removed: false };
    delete newList._id;
    db.databases.lists.update(
      { id: newList.id },
      { $set: newList },
      {},
      function (err) {
        if (!err) {
          editList(newList, store.dispatch, function () {});
        } else {
          console.log(err);
        }
      }
    );
  }
  return (
    <GarbageItemWrapper
      restore={restoreList}
      loading={loading}
      remove={async function () {
        setLoading(true);
        await removeList(list.id);
        setLoading(false);
      }}
    >
      <List list={list} board={{}} dropdownDisabled={true} />
    </GarbageItemWrapper>
  );
}

export function GarbageItemWrapper({ remove, restore, loading, children }) {
  return (
    <div className={styles["garbage-item-wrapper"]}>
      {children}

      <div className={styles["options"]}>
        <div className="g-btn g-btn-rounded btn-small" onClick={restore}>
          <span>Restore</span>
        </div>

        <button
          className="g-btn g-btn-danger g-btn-rounded btn-small"
          onClick={remove}
          disabled={loading}
        >
          <span>{loading ? "removing..." : "Remove"}</span>
        </button>
      </div>
    </div>
  );
}

export function BoardCard(props) {
  const [loading, setLoading] = useState(false);
  let board = useSelector(function (state) {
    return state.boards.filter(function (b) {
      if (b.id === props.board.id) {
        return b;
      }
    })[0];
  });
  let dispatch = useDispatch();

  function restore() {
    let newBoard = {
      ...board,
      removed: false,
    };
    db.databases.boards.update(
      { id: newBoard.id },
      { $set: newBoard },
      {},
      function (err) {
        if (!err) {
          dispatch(boardsSlice.actions.editBoard(newBoard));
        } else {
          console.log(err);
        }
      }
    );
  }

  async function remove() {
    setLoading(true);
    await removeBoard(board.id);
    setLoading(false);
  }
  return (
    <BoardCardContainer
      board={board}
      loading={loading}
      remove={remove}
      restore={restore}
    />
  );
}

export function GarbageHeader(props) {
  const { name, restoreAll, removeAll } = props;
  return (
    <div className={styles["header"]}>
      <h1>{name}</h1>
      {/* <div className="g-btn g-btn-rounded" onClick={restoreAll}>
                <span>Restore all</span>    
            </div>

            <div className="g-btn g-btn-danger g-btn-rounded" onClick={removeAll}>
                <span>Remove All</span>
            </div> */}
    </div>
  );
}

export function ProjectGarbage() {
  let projects = useSelector((state) => {
    return state.projects.projects
      .filter(function (proj) {
        if (proj.removed) {
          return proj;
        }
      })
      .sort((a, b) => a.queue - b.queue);
  });
  let dispatch = useDispatch();
  let { error, setError } = useContext(ErrorContext);

  function restoreAll() {
    for (let project of projects) {
      let newProject = { ...project, removed: false };
      db.databases.projects.update(
        { id: newProject.id },
        { $set: newProject },
        {},
        function (err) {
          if (!err) {
            dispatch(projectsSlice.actions.editProject(newProject));
          } else {
            console.log(err);
            setError({
              title: "Database Error",
              message: err,
            });
          }
        }
      );
    }
  }

  async function removeAll() {
    for await (const project of projects) {
      await removeProject(project.id);
    }
  }
  return (
    <div className="project-garbage">
      <GarbageHeader
        name={"Projects"}
        restoreAll={restoreAll}
        removeAll={removeAll}
      />
      <div className={styles["list"]}>
        {projects.length === 0 ? (
          <div className="empty">
            <div className="msg">No removed projects to show</div>
          </div>
        ) : (
          projects.map(function (proj, index) {
            return (
              <GarbageItemWrapper
                key={index}
                remove={async function () {
                  await removeProject(proj.id);
                }}
                restore={function () {
                  let newProject = { ...proj, removed: false };
                  db.databases.projects.update(
                    { id: newProject.id },
                    { $set: newProject },
                    {},
                    function (err) {
                      if (!err) {
                        dispatch(projectsSlice.actions.editProject(newProject));
                      } else {
                        console.log(err);
                        setError({
                          title: "Database Error",
                          message: err,
                        });
                      }
                    }
                  );
                }}
              >
                <Project infos={proj} key={index} />
              </GarbageItemWrapper>
            );
          })
        )}
      </div>
    </div>
  );
}
export function BoardCarbage() {
  let boards = useSelector((state) => {
    return state.boards
      .filter(function (board) {
        if (board.removed) {
          return board;
        }
      })
      .sort((a, b) => a.queue - b.queue);
  });

  let dispatch = useDispatch();
  function restoreAll() {
    for (let board of boards) {
      let newBoard = {
        ...board,
        removed: false,
      };
      db.databases.boards.update(
        { id: newBoard.id },
        { $set: newBoard },
        {},
        function (err) {
          if (!err) {
            dispatch(boardsSlice.actions.editBoard(newBoard));
          } else {
            console.log(err);
          }
        }
      );
    }
  }

  async function removeAll() {
    for await (let board of boards) {
      await removeBoard(board.id);
    }
  }
  return (
    <div className="project-garbage">
      <GarbageHeader
        name={"Boards"}
        restoreAll={restoreAll}
        removeAll={removeAll}
      />
      <div className={styles["list"]}>
        {boards.length === 0 ? (
          <div className="empty">
            <div className="msg">No removed boards to show</div>
          </div>
        ) : (
          boards.map(function (board, index) {
            return <BoardCard board={board} key={index} />;
          })
        )}
      </div>
    </div>
  );
}

export function arrangeLists(lists) {
  let components = [];
  let doc = {};

  for (let list of lists) {
    let board = store.getState().boards.filter(function (b) {
      if (b.id === list.board_id) return b;
    })[0];
    if (doc[board.name]) {
      doc[board.name].push(list);
    } else {
      doc[board.name] = [list];
    }
  }

  let index = 0;
  for (const key in doc) {
    components.push(
      <h2
        style={{
          padding: "15px",
          color: "var(--theme2-red)",
        }}
        key={index}
      >
        {key}
      </h2>
    );
    components.push(
      <div className={styles["list"]} key={index + 1}>
        {lists.length === 0 ? (
          <div className="empty">
            <div className="msg">No removed Lists to show</div>
          </div>
        ) : (
          <ResponsiveMasonry
            style={{ width: "100%" }}
            columnsCountBreakPoints={{
              400: 1,
              600: 2,
              1000: 3,
              1200: 4,
              1400: 5,
              1600: 6,
            }}
          >
            <Masonry columnsCount={3} gutter="15px">
              {doc[key].map(function (list, index) {
                return <ListContainer list={list} key={index} />;
              })}
            </Masonry>
          </ResponsiveMasonry>
        )}
      </div>
    );
    index++;
  }

  return components;
}

export function ListCarbage() {
  let lists = useSelector((state) => {
    return state.lists
      .filter(function (list) {
        if (list.removed) {
          return list;
        }
      })
      .sort((a, b) => a.queue - b.queue);
  });

  return (
    <div className="project-garbage">
      <GarbageHeader name={"Board Lists"} />
      {lists.length === 0 ? (
        <div className="empty" style={{ margin: "15px", width: "auto" }}>
          <div className="msg">No removed Lists to show</div>
        </div>
      ) : (
        arrangeLists(lists)
      )}
    </div>
  );
}

export const garbageRouter = {
  project: <ProjectGarbage />,
  board: <BoardCarbage />,
  list: <ListCarbage />,
};
export default function Garbage() {
  let [activeGarbage, setActiveGarbage] = useState("project");
  return (
    <div className={styles["garbage"]}>
      <div className={styles["side-bar"]}>
        <h1>
          <FiTrash /> Garbage
        </h1>
        <div className={styles["side-bar-items"]}>
          <div
            className={
              styles["side-bar-item"] +
              (activeGarbage === "project" ? " " + styles["nav-active"] : "")
            }
            onClick={function () {
              setActiveGarbage("project");
            }}
          >
            <span>
              <FiFolder /> Projects
            </span>
          </div>
          <div
            className={
              styles["side-bar-item"] +
              (activeGarbage === "board" ? " " + styles["nav-active"] : "")
            }
            onClick={function () {
              setActiveGarbage("board");
            }}
          >
            <span>
              <FiClipboard /> Boards
            </span>
          </div>
          <div
            className={
              styles["side-bar-item"] +
              (activeGarbage === "list" ? " " + styles["nav-active"] : "")
            }
            onClick={function () {
              setActiveGarbage("list");
            }}
          >
            <span>
              <FiList /> Lists
            </span>
          </div>
          {/* <div className={styles["side-bar-item"]}>
                        <span><i className="fa fa-folder" aria-hidden="true"></i> Cards</span>
                    </div> */}
        </div>
      </div>

      <div className={styles["garbage-body"]}>
        {garbageRouter[activeGarbage]}
      </div>
    </div>
  );
}
