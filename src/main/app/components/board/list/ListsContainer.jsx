import React from "react";
import styles from "../board.module.css";
import List, { genID } from "./List.jsx";
import greberDB from "../../../db/main";
import listsSlice from "../../../features/lists/listsSlice";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { FiPlus } from "react-icons/fi";

export const ListsContainerMemo = React.memo(ListsContainer);
export default function ListsContainer({ board, lists, dispatch }) {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        300: 1,
        600: 2,
        900: 3,
        1200: 4,
        1400: 5,
        1600: 6,
      }}
    >
      <Masonry columnsCount={3} className={styles["list-container"]}>
        {lists
          .sort((a, b) => a.queue - b.queue)
          .map(function (list, index) {
            return (
              <List
                list={{ ...list, _id: undefined }}
                key={index}
                board={board}
              ></List>
            );
          })}

        <button
          className={styles["add-list"]}
          onClick={function () {
            let newList = {
              id: genID(10),
              name: "New List",
              board_id: board.id,
              cards: [],
              queue: lists.length + 1,
            };
            greberDB.databases.lists.insert(newList, function (err, doc) {
              if (!err) {
                dispatch(listsSlice.actions.addList(newList));
              } else {
                setError(err);
              }
            });
          }}
        >
          <span>
            <FiPlus />{" "}
          </span>
        </button>
      </Masonry>
    </ResponsiveMasonry>
  );
}
