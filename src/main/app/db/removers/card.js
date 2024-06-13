import store from "../../store";
// checklist
import cardChecklistsSlice from "../../features/cards/cardChecklistsSlice";
import checklistItemsSlice from "../../features/cards/checklistItemsSlice";
// activity
import cardActivityslice from "../../features/cards/cardActivityslice";

// database
import greberDB from "../main";
import cardsSlice from "../../features/cards/cardsSlice";
import { removeCover } from "../../../utils/upload";

// remover card items definitely
export const ChecklistRemover = {
  removeItem: function (id) {
    let action = checklistItemsSlice.actions.delItem({ id });
    return new Promise(function (resolve, reject) {
      greberDB.databases.checklistItems.remove(
        {
          id,
        },
        function (err) {
          if (!err) {
            store.dispatch(action);
            resolve(true);
          } else {
            reject(err);
          }
        }
      );
    });
  },
  removeChecklist: function (id) {
    let action = cardChecklistsSlice.actions.delChecklist({ id });
    let checklistItems = store
      .getState()
      .checklistItems.filter(function (item) {
        if (item.checklist_id === id) {
          return item;
        }
      });
    return new Promise(function (resolve, reject) {
      greberDB.databases.cardChecklists.remove(
        {
          id,
        },
        function (err) {
          if (!err) {
            (async function () {
              for await (let item of checklistItems) {
                let promise = await ChecklistRemover.removeItem(item.id);
              }

              store.dispatch(action);
              resolve(true);
            })();
          } else {
            reject(err);
          }
        }
      );
    });
  },
  removeAll: function (card_id) {
    let listChecklist = store
      .getState()
      .cardChecklists.filter(function (checklist) {
        if (checklist.card_id === card_id) {
          return checklist;
        }
      });
    return new Promise(function (resolve, reject) {
      (async function () {
        try {
          for await (let checklist of listChecklist) {
            await ChecklistRemover.removeChecklist(checklist.id);
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      })();
    });
  },
};

export const ActivityRemover = {
  removeActivity: function (id) {
    let action = cardActivityslice.actions.delActivity({ id });
    return new Promise(function (resolve, reject) {
      let db = greberDB.databases.cardActivity;
      db.remove({ id }, function (err) {
        if (!err) {
          store.dispatch(action);
          resolve(true);
        } else {
          resolve(err);
        }
      });
    });
  },
  removeAll: function (card_id) {
    let listActivity = store
      .getState()
      .cardActivity.filter(function (activity) {
        if (activity.card_id === card_id) {
          return activity;
        }
      });
    return new Promise(function (resolve, reject) {
      (async function () {
        try {
          for await (let activity of listActivity) {
            await ActivityRemover.removeActivity(activity.id);
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      })();
    });
  },
};

export default function removeCard(id) {
  let action = cardsSlice.actions.removeCard({ id });
  return new Promise(function (resolve, reject) {
    greberDB.databases.cards.remove({ id }, function (err) {
      if (!err) {
        (async function () {
          try {
            await removeCover(id);
            await ChecklistRemover.removeAll(id);
            await ActivityRemover.removeAll(id);
            store.dispatch(action);
            resolve(true);
          } catch (error) {
            reject(error);
          }
        })();
      } else {
        reject(err);
      }
    });
  });
}
