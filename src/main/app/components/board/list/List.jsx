import React, { useEffect, useState, useContext } from "react";
import { useStore } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { ErrorContext } from "../../../App.jsx";
import greberDB from "../../../db/main";
import cardsSlice from "../../../features/cards/cardsSlice";
import listsSlice from "../../../features/lists/listsSlice";
import { DropdownContext } from "../Board.jsx";
import Card from "../card/Card.jsx";
import "./list.css";
import db from "../../../db/main";
import removeCard from "../../../db/removers/card.js";

import { FiMoreHorizontal, FiMoreVertical, FiPlus } from "react-icons/fi";
/**
 * generate unique id
 * @param length length of the id (10 by default)
 */
export function genID(length = 10) {
  let num = Math.floor(Math.random() * 10 ** length);
  return num;
}

export function editList(newList, dispatch, callback) {
  greberDB.databases["lists"].update(
    {
      id: newList.id,
    },
    { $set: newList },
    {},
    function () {
      dispatch(listsSlice.actions.editList(newList));

      callback(newList);
    }
  );
}
function ListDropdown(props) {
  const { list, setListDropdownHidden } = props;
  const [right, setRight] = useState(false);
  // const {error,setError} = useContext(ErrorContext);

  const dispatch = useDispatch();
  const store = useStore();
  useEffect(function () {
    let el = document.getElementsByClassName("list-dropdown")[0];
    let rects = el.getBoundingClientRect();
    if (rects.x > window.innerWidth - el.offsetWidth - 20) {
      setRight(true);
    }
  }, []);

  function DropdownItem({ item, danger }) {
    return (
      <div
        className="ld-item"
        style={{ background: danger ? "var(--theme2-dark-red)" : null }}
        onClick={item.onClick}
      >
        <span style={{ color: danger ? "white" : null }}>{item.name}</span>
      </div>
    );
  }

  const dropdownItems = [
    <DropdownItem
      key={1}
      item={{
        name: <> Empty List</>,
        onClick: async function () {
          const cards = store.getState().cards.filter(function (card) {
            return card.list_id === list.id;
          });

          for await (const card of cards) {
            await removeCard(card.id);
          }
        },
      }}
    />,
    <DropdownItem
      key={2}
      item={{
        name: <> Remove List</>,
        onClick: async function () {
          let newList = { ...list, removed: true };
          delete newList._id;
          db.databases.lists.update(
            { id: newList.id },
            { $set: newList },
            {},
            function (err) {
              if (!err) {
                editList(newList, dispatch, function () {
                  setListDropdownHidden({});
                });
              } else {
                console.log(err);
              }
            }
          );
        },
      }}
    />,
  ];
  return (
    <div
      className="list-dropdown"
      style={
        right
          ? {
              top: "unset",
              left: "unset",
              right: "0px",
            }
          : {}
      }
    >
      <h3>List Options</h3>
      <hr />
      {dropdownItems.map(function (el) {
        return el;
      })}
    </div>
  );
}

export function CardList({ cards, setaddCardActive }) {
  return (
    <div className="card-list">
      {cards
        .sort((a, b) => a.queue - b.queue)
        .map(function (card, index) {
          return (
            <Card card={card} key={index} setaddCardActive={setaddCardActive} />
          );
        })}
    </div>
  );
}
function List(props) {
  const { list, board, dropdownDisabled } = props;

  // Selectors
  const _list = useSelector(function (state) {
    return state.lists.filter(function (selected_list) {
      if (list.id == selected_list.id) {
        return selected_list;
      }
    });
  })[0];
  const cards = useSelector(function (state) {
    return state.cards.filter(function (card) {
      if (card.list_id === list.id && !card.removed) {
        return card;
      }
    });
  });

  // Component States
  const [titleClicked, setTitleClicked] = useState(false);
  const [listTitle, setListTitle] = useState(_list.name);
  const [addCardActive, setaddCardActive] = useState(true);

  // Contexts
  const { activeDropdown, setActiveDropdown } = useContext(DropdownContext);
  const { setError } = useContext(ErrorContext);

  // store dispatch
  const dispatch = useDispatch();

  // component functions
  function addCard() {
    let id = Math.floor(Math.random() * 1000000);
    let created_at = new Date();
    let newCard = {
      id,
      name: "",
      list_id: list.id,
      created_at,
      queue: cards.length + 1,
    };
    greberDB.databases.cards.insert(newCard, function (err) {
      if (!err) {
        dispatch(cardsSlice.actions.addCard(newCard));
      } else {
        setError(err);
      }
    });
  }
  function editList(new_list) {
    let __list = {};

    for (let key in new_list) {
      if (key !== "_id") {
        __list[key] = new_list[key];
      }
    }
    greberDB.databases.lists.update(
      { id: new_list.id },
      { $set: __list },
      {},
      function (err, numReplaced) {
        if (!err) {
          dispatch(listsSlice.actions.editList(new_list));
        } else {
          console.log(err);
          setError(err);
        }
      }
    );
  }
  return (
    <div
      className="list"
      draggable={!dropdownDisabled}
      onDragOver={
        !dropdownDisabled
          ? function (e) {
              e.preventDefault();
              e.currentTarget.style.opacity = 0.7;
            }
          : null
      }
      onDragStart={
        !dropdownDisabled
          ? function (e) {
              e.dataTransfer.setData(
                "text/plain",
                JSON.stringify({ ..._list, _id: undefined })
              );
              e.currentTarget.style.opacity = 0.7;
            }
          : null
      }
      onDragLeave={
        !dropdownDisabled
          ? function (e) {
              e.preventDefault();
              e.currentTarget.style.opacity = 1;
            }
          : null
      }
      onDropCapture={function (e) {
        let exchangelist = JSON.parse(e.dataTransfer.getData("text/plain"));

        if (exchangelist.queue) {
          editList({ ..._list, queue: exchangelist.queue });
          editList({
            ...exchangelist,
            queue: _list.queue,
          });
        }
        e.currentTarget.style.opacity = 1;
      }}
      onDragEnd={function (e) {
        e.preventDefault();
        e.currentTarget.style.opacity = 1;
      }}
    >
      <div className="list-header">
        {titleClicked ? (
          <div className="title-input">
            <input
              type="text"
              placeholder="List Title"
              value={listTitle}
              onKeyDown={function (e) {
                let key = e.key;

                if (key === "Enter" && listTitle !== "") {
                  let new_list = { ..._list, name: listTitle };
                  editList(new_list);
                  setTitleClicked(false);
                }
              }}
              onChange={function (e) {
                let value = e.currentTarget.value;
                setListTitle(value);
              }}
            />
          </div>
        ) : (
          <span
            title={_list.name}
            onClick={function () {
              setTitleClicked(true);
            }}
          >
            {_list.name}
          </span>
        )}
        {!dropdownDisabled ? (
          <div className="list-options">
            <span
              className="options-btn"
              onClick={function () {
                if (activeDropdown.id) {
                  setActiveDropdown({});
                } else {
                  let id = list.id;
                  setActiveDropdown({ id });
                }
              }}
            >
              <FiMoreHorizontal />
            </span>
            {list.id === activeDropdown.id ? (
              <ListDropdown
                id={list.id}
                board={board}
                list={list}
                setListDropdownHidden={setActiveDropdown}
              />
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
      <CardList cards={cards} setaddCardActive={setaddCardActive} />
      <button
        className="add-card-btn"
        onClick={function () {
          if (addCardActive) {
            addCard();
          }
        }}
        disabled={!addCardActive}
      >
        <FiPlus />
      </button>
    </div>
  );
}

export default List;
