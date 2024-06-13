import { ModalContainer } from "./CreateProjectModal.jsx";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import boardsSlice from "../../features/boards/boardsSlice.js";
import greberDB from "../../db/main.js";
import store from "../../store.js";
import { globalColors } from "../../../utils/globals.js";
import { FiCheck, FiPlus } from "react-icons/fi";

export default function CreateBoardModal(props) {
  const { project, setModalActive } = props;
  const [activeBg, setActiveBg] = useState("#0079BF");
  const [boardBgs, setBoardBgs] = useState(globalColors);
  const [boardName, setBoardName] = useState("");
  const [boardDesc, setBoardDesc] = useState("");
  const dispatch = useDispatch();

  function saveBoard() {
    let newBoard = {
      id: Math.floor(Math.random() * 1000000),
      name: boardName,
      desc: boardDesc,
      project_id: project.id,
      background: activeBg,
      queue: store.getState().boards.length + 1,
    };
    greberDB.databases["boards"].insert(newBoard, function (err, doc) {
      if (!err) {
        dispatch(boardsSlice.actions.addBoard(newBoard));
      } else {
        console.log(err);
      }
      setModalActive(false);
    });
  }
  return (
    <ModalContainer setModalActive={setModalActive}>
      <div className="board-modal modal">
        <div className="board-modal-content">
          <div className="project-infos">
            <h1 className="title">
              <FiPlus /> Create Board
            </h1>
          </div>
          <div className="board-body">
            <div
              className="board-infos"
              style={{
                background: activeBg,
              }}
            >
              <input
                type="text"
                placeholder="Board Title"
                className="board-input"
                value={boardName}
                onChange={function (e) {
                  let value = e.currentTarget.value;
                  setBoardName(value);
                }}
              />
              <textarea
                className="board-input"
                placeholder="board description"
                value={boardDesc}
                onChange={function (e) {
                  let value = e.currentTarget.value;
                  setBoardDesc(value);
                }}
              ></textarea>
              <div
                className="g-btn"
                onClick={boardName ? saveBoard : undefined}
              >
                <span>Create</span>
              </div>
            </div>
            <div className="board-bg">
              <span>Background</span>
              <div className="bg-list">
                {boardBgs.map(function (bg, index) {
                  return (
                    <div
                      className="bg"
                      style={{
                        background: bg,
                      }}
                      onClick={function () {
                        setActiveBg(bg);
                      }}
                      key={index}
                    >
                      {(function () {
                        if (activeBg === bg) {
                          return (
                            <div>
                              <FiCheck />
                            </div>
                          );
                        }
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
}
