import React, { useState, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListsContainer from "./list/ListsContainer.jsx";
import boardsSlice from "../../features/boards/boardsSlice";
import { useContext } from "react";
import greberDB from "../../db/main";
import { ErrorContext } from "../../App.jsx";
import styles from "./board.module.css";

export const DropdownContext = createContext({
  activeDropdown: {},
  setActiveDropdown: function () {},
});
DropdownContext.displayName = "list-dropdown";

function Board(props) {
  let { board } = props;
  // selectors
  let lists = useSelector(function (state) {
    return state.lists.filter(function (list) {
      if (board.id === list.board_id && !list.removed) {
        return list;
      }
    });
  });
  let _board = useSelector(function (state) {
    for (let selected_board of state.boards) {
      if (board.id === selected_board.id) {
        return selected_board;
      }
    }
  });
  // states
  let [boardEditing, setBoardEditing] = useState(false);
  let [activeDropdown, setActiveDropdown] = useState(false);
  let [boardName, setBoardName] = useState(_board.name);
  const dispatch = useDispatch();

  //  useful function
  function editBoard(new_board) {
    greberDB.databases["boards"].update(
      {
        id: new_board.id,
      },
      { $set: new_board },
      {},
      function () {
        dispatch(boardsSlice.actions.editBoard(new_board));
      }
    );
  }

  return (
    <DropdownContext.Provider
      value={{
        activeDropdown,
        setActiveDropdown,
      }}
    >
      <div
        className={styles["board-container"]}
        onClick={function (e) {
          let target = e.target;
          let container = document.getElementsByClassName("list-dropdown")[0];
          if (container) {
            if (!(container === target) && !container.contains(target)) {
              setActiveDropdown({});
            }
          }
        }}
        style={{
          background: _board.background,
        }}
      >
        <style>
          {`


                    .${styles["board-container"]} * {
                        color : ${_board.background}
                    }
                    

                    .list .add-card-btn:hover
                    {
                        background-color: ${_board.background};
                      
                    }
                                        `}
        </style>

        {/* <div className={styles["board-header"]}>
            {
                boardEditing ? <>
                    <input type="text" className={styles['board-name-edit']} value={boardName}  onKeyDown={
                    function (e) {
                        let key = e.key;
                        if (key === "Enter")
                        {
                            
                            let new_board = {..._board,name:boardName};
                            
                            editBoard(new_board);
                            setBoardEditing(false);
                        }
                    }
                } onChange={
                    function (e) {
                        let value = e.currentTarget.value;
                        setBoardName(value);
                    }
                }/>
                <span className={styles['cancel-edit']} onClick={
                    function () {
                        setBoardEditing(false);
                    }
                }><i className="fa fa-times" aria-hidden="true"></i></span>
                </> : <h1 onClick={function () {
                    setBoardEditing(true);
                }}>{_board.name}</h1>
            }
            </div> */}

        <div className={styles["board-body"]}>
          <ListsContainer lists={lists} board={_board} dispatch={dispatch} />
        </div>
      </div>
    </DropdownContext.Provider>
  );
}

export default Board;
