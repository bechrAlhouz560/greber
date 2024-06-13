import moment from "moment/moment";
import React from "react";
import { useEffect } from "react";
import { useStore } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { getCoverPath } from "../../../../utils/getAppData";
import greberDB from "../../../db/main";
import cardsSlice from "../../../features/cards/cardsSlice";
import { Labels } from "./CardEditor.jsx";
import { FiClock, FiCheckCircle } from "react-icons/fi";

export function CardBody({ card, checked, selectedCard, checklists, onClick }) {
  function deadlineReached() {
    let now = new Date().getTime();
    let deadline = new Date(card.deadline).getTime();
    return deadline < now;
  }
  return (
    <div className="card-body" onClick={onClick}>
      <Labels card={card}></Labels>
      <span
        className="card-name"
        style={{
          color:
            selectedCard.bg === "white" || !selectedCard.bg ? "black" : "white",
        }}
      >
        {selectedCard.name}
      </span>
      <span
        className="card-desc"
        style={{
          color:
            selectedCard.bg === "white" || !selectedCard.bg ? "black" : "white",
        }}
      >
        {card.desc}
      </span>
      {
        <div className="card-infos">
          {checklists.length !== 0 ? (
            <div
              className="card-info"
              style={{
                background:
                  checked().length === checklists.length
                    ? "rgb(81, 152, 57)"
                    : "rgb(210, 144, 52)",
                color: "white",
              }}
            >
              <FiCheckCircle fill="white" /> {checked().length} /{" "}
              {checklists.length}
            </div>
          ) : (
            ""
          )}

          {card.deadline ? (
            <div
              className="card-deadline card-info"
              style={{
                backgroundColor: deadlineReached()
                  ? "var( --theme2-red)"
                  : "#e7e7e7",
              }}
            >
              <span>
                <FiClock
                  size={15}
                  color={deadlineReached() ? "white" : "#222222"}
                />{" "}
              </span>

              <span style={{ color: deadlineReached() ? "white" : "#222222" }}>
                {(function () {
                  let date = new Date(card.deadline);
                  //    let day = date.toDateString().split(' ')[2];
                  //    let month = date.toDateString().split(' ')[1];
                  //    let year = date.getFullYear();
                  //    return `${day}, ${month} ${year}`;

                  return moment(date).calendar();
                })()}
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
      }
    </div>
  );
}
export default function Card(props) {
  const { card, setaddCardActive } = props;
  // selectors
  const cardName = useSelector(function (state) {
    return state.cards.filter(function (_card) {
      if (card.id === _card.id) {
        return _card.name;
      }
    });
  })[0];

  const selectedCard = useSelector(function (state) {
    return state.cards.filter(function (_card) {
      if (card.id === _card.id) {
        return _card;
      }
    });
  })[0];

  const checklists = useSelector(function (state) {
    return state.cardChecklists.filter(function (checklist) {
      if (card.id === checklist.card_id && !checklist.removed) {
        return checklist;
      }
    });
  });
  // states and hooks
  const dispatch = useDispatch();

  const store = useStore();

  useEffect(() => {
    if (!cardName) {
      setaddCardActive(false);
    }
  }, []);
  function completedChecklists() {
    // check for completed checklists
    let completed = [];

    for (let checklist of checklists) {
      let checked = true;
      let checklistItems = store
        .getState()
        .checklistItems.filter(function (item) {
          if (item.checklist_id === checklist.id) {
            return item;
          }
        });
      for (let item of checklistItems) {
        if (!item.checked) {
          checked = false;
          break;
        }
      }
      if (checked) {
        completed.push(checklist);
      }
    }
    return completed;
  }

  return (
    <div
      className="card"
      style={{
        background: selectedCard.bg,
      }}
    >
      {(function () {
        if (selectedCard.img) {
          return (
            <div className="card-cover">
              <img
                src={getCoverPath(selectedCard.img)}
                draggable="false"
                alt=""
              />
            </div>
          );
        }
      })()}
      {(function () {
        if (!selectedCard.name) {
          return (
            <div className="card-name-input">
              <input
                type="text"
                placeholder="Card Title..."
                onKeyDown={function (e) {
                  let key = e.key;
                  if (key === "Enter") {
                    let value = e.currentTarget.value;
                    let newCard = {
                      ...card,
                      name: value,
                    };
                    greberDB.databases.cards.update(
                      { id: newCard.id },
                      { $set: newCard },
                      {},
                      function (err, numReplaced) {
                        if (!err) {
                          dispatch(cardsSlice.actions.editCard(newCard));
                        }
                      }
                    );
                  }
                }}
              />
            </div>
          );
        } else {
          setaddCardActive(true);
          return (
            <CardBody
              onClick={function () {
                dispatch({
                  type: "cardEditor/setActive",
                  payload: cardName,
                });
              }}
              card={card}
              checked={completedChecklists}
              checklists={checklists}
              selectedCard={selectedCard}
            />
          );
        }
      })()}
    </div>
  );
}
