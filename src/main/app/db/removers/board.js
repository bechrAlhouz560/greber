import boardsSlice from "../../features/boards/boardsSlice";
import store from "../../store";
import greberDB from "../../db/main";
import removeCard from "../../db/removers/card";
import listsSlice from "../../features/lists/listsSlice";

export function removeList(id) {
  let action = listsSlice.actions.removeList({
    id,
  });
  let cards = store.getState().cards.filter(function (card) {
    if (card.list_id === id) {
      return card;
    }
  });

  return new Promise(function (resolve, reject) {
    let db = greberDB.databases.lists;
    db.remove(
      {
        id,
      },
      function (err) {
        if (!err) {
          (async function () {
            try {
              for await (let card of cards) {
                await removeCard(card.id, card.img);
              }
              store.dispatch(action);
              resolve(true);
            } catch (error) {
              reject(error);
            }
          })();
        } else {
          reject(err);
        }
      }
    );
  });
}

export default function removeBoard(id) {
  let action = boardsSlice.actions.removeBoard({ id });
  let lists = store.getState().lists.filter(function (list) {
    if (list.board_id === id) {
      return list;
    }
  });
  return new Promise(function (resolve, reject) {
    let db = greberDB.databases.boards;
    db.remove(
      {
        id,
      },
      function (err) {
        if (!err) {
          (async function () {
            try {
              for await (let list of lists) {
                await removeList(list.id);
              }
              store.dispatch(action);
              resolve(true);
            } catch (error) {
              reject(error);
            }
          })();
        } else {
          reject(err);
        }
      }
    );
  });
}
