import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import cardActivityslice from "../../../features/cards/cardActivityslice.js";
import cardChecklistsSlice from "../../../features/cards/cardChecklistsSlice.js";
import cardsSlice from "../../../features/cards/cardsSlice.js";
import checklistItemsSlice from "../../../features/cards/checklistItemsSlice.js";
import { ModalContainer } from "../../modals/CreateProjectModal.jsx";
import greberDB from "../../../db/main.js";

import { removeCover, uploadCover } from "../../../../utils/upload";
import "./card-editor.css";
import cardLabels from "../../../features/cards/cardLabels.js";

import cardBg from "../../../../../assets/bg.png";
import UploadImg from "../../../../../assets/SVG/up_img_1.svg";
import { ErrorContext } from "../../../App.jsx";
import { globalColors } from "../../../../utils/globals.js";
import { getCoverPath } from "../../../../utils/getAppData.js";
import { genID } from "../list/List.jsx";
import {
  FiAlignLeft,
  FiCheck,
  FiCheckSquare,
  FiClock,
  FiEdit,
  FiFile,
  FiMessageCircle,
  FiPaperclip,
  FiPlus,
  FiTag,
  FiTrash,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import { toBase64Sync } from "../../../../utils/copy.js";
import { MdEdit } from "react-icons/md";
// editor functions and tools
export function editCard(newCard, dispatch) {
  let _newCard = {};

  for (let key in newCard) {
    if (key !== "_id") {
      _newCard[key] = newCard[key];
    }
  }
  greberDB.databases.cards.update(
    { id: newCard.id },
    { $set: _newCard },
    {},
    function (err, numReplaced) {
      if (!err) {
        dispatch(cardsSlice.actions.editCard(_newCard));
      } else {
        console.log(err);
      }
    }
  );
}

export function editLabel(label, dispatch) {
  greberDB.databases.cardLabels.update(
    { id: label.id },
    { $set: label },
    {},
    function (err, numReplaced) {
      if (!err) {
        dispatch(cardLabels.actions.editLabel(label));
      }
    }
  );
}

export function editCardActivity(act, dispatch) {
  greberDB.databases.cardActivity.update(
    { id: act.id },
    { $set: act },
    {},
    function (err, numReplaced) {
      if (!err) {
        dispatch(cardActivityslice.actions.editActivity(act));
      } else {
        console.log(err);
      }
    }
  );
}
function removeCard(card, dispatch) {
  // remove card (including  all the checklists and activitis etc...)
  editCard(
    {
      ...card,
      removed: true,
    },
    dispatch
  );
  dispatch({
    type: "cardEditor/setInActive",
  });
}

// secondary components

export function EditActivity(props) {
  let { activity, setEditing } = props;
  let [actName, setActName] = useState(activity.name);
  let dispatch = useDispatch();
  return (
    <div className="add-activity">
      <input
        type="text"
        placeholder="Edit Activity..."
        value={actName}
        onKeyDown={function (e) {
          let key = e.key;

          if (key === "Enter") {
            setEditing(false);
            editCardActivity(
              {
                ...activity,
                name: actName,
              },
              dispatch
            );
          }
        }}
        onChange={function (e) {
          let value = e.currentTarget.value;
          setActName(value);
        }}
      />
      {/* <FileSelector isEditing={editing} activity={activity}></FileSelector> */}
    </div>
  );
}

export function Activity(props) {
  let { ["activity"]: act } = props;
  let dispatch = useDispatch();
  let [editing, setEditing] = useState(false);
  let activity = useSelector(function ({ cardActivity }) {
    for (let _act of cardActivity) {
      if (act.id === _act.id) {
        return _act;
      }
    }
  });
  return !editing ? (
    <div className="activity">
      <div className="act-body">
        <p className="created_at">{moment(activity.created_at).calendar()}</p>
        <p className="activity-name">{activity.name}</p>
      </div>
      <div className="act-options">
        <div
          className="act-option"
          onClick={function () {
            setEditing(true);
          }}
        >
          <span>
            <FiEdit />
          </span>
        </div>
        <div
          className="act-option"
          onClick={function () {
            editCardActivity(
              {
                ...activity,
                removed: true,
              },
              dispatch
            );
          }}
        >
          <span>
            <FiTrash />
          </span>
        </div>
      </div>
    </div>
  ) : (
    <EditActivity
      activity={activity}
      setEditing={setEditing}
      editing={editing}
    />
  );
}

export function LabelsDropdown(props) {
  const { card, setLabelDropdownActive, labelDropdownActive } = props;
  const labels = useSelector(function (state) {
    return state.cardLabels.filter(function (label) {
      if (!label.removed) {
        return label;
      }
    });
  });
  const _card = useSelector(function (state) {
    return state.cards.filter(function (selectedCard) {
      if (selectedCard.id === card.id) {
        return selectedCard;
      }
    });
  })[0];
  const dispatch = useDispatch();

  let [activeBg, setActiveBg] = useState(globalColors[0]);
  let [labelName, setLabelName] = useState("");
  const { error, setError } = useContext(ErrorContext);

  function addLabel(newLabel) {
    greberDB.databases.cardLabels.insert(newLabel, function (err) {
      if (!err) {
        dispatch(cardLabels.actions.addLabel(newLabel));
      } else {
        setError(err);
      }
    });
  }

  function addLabelToCard(label) {
    let labels;
    if (!_card.labels) {
      labels = [label.id];
    } else {
      if (_card.labels.indexOf(label.id) === -1) {
        labels = [..._card.labels, label.id];
      } else {
        labels = [
          ..._card.labels.filter(function (_label) {
            if (_label !== label.id) {
              return _label;
            }
          }),
        ];
      }
    }

    editCard(
      {
        ...card,
        labels,
      },
      dispatch
    );
  }
  function Label(props) {
    const { label } = props;
    const [editing, setEditing] = useState(false);

    return !editing ? (
      <div
        className="d-label"
        style={{
          background: label.bg,
        }}
      >
        <span
          style={{
            flex: 1,
          }}
          onClick={function () {
            addLabelToCard(label);
          }}
        >
          {label.name}
        </span>
        {_card.labels ? (
          _card.labels.indexOf(label.id) !== -1 ? (
            <span>
              <FiCheck />
            </span>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        <span
          onClick={function () {
            editLabel(
              {
                ...label,
                removed: true,
              },
              dispatch
            );
          }}
          style={{ marginLeft: 5 }}
        >
          <FiTrash />
        </span>
      </div>
    ) : (
      <div className="editing-label">
        <input type="text" />
      </div>
    );
  }
  return (
    <div className="labels-dropdown">
      <div className="dropdown-header">
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Labels
        </span>
        <span
          style={{
            opacity: ".7",
            cursor: "pointer",
          }}
          onClick={function () {
            setLabelDropdownActive(false);
          }}
        >
          {" "}
          <FiX />{" "}
        </span>
      </div>
      <div className="dropdown-body">
        <div className="d-labels">
          {labels.map(function (label, index) {
            return <Label label={label} key={index} />;
          })}
        </div>
        <div
          className="add-label"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "10px",
            paddingTop: 0,
          }}
        >
          <h3>Add Label</h3>

          <input
            type="text"
            placeholder="name..."
            value={labelName}
            onChange={function (e) {
              let value = e.currentTarget.value;
              setLabelName(value);
            }}
            className="default-input"
          />
          <div className="bg-list">
            {globalColors.map(function (bg, index) {
              return (
                <div
                  className="bg"
                  key={index}
                  style={{
                    background: bg,
                  }}
                  onClick={function () {
                    setActiveBg(bg);
                  }}
                >
                  {(function () {
                    if (activeBg === bg) {
                      return (
                        <div>
                          <FiCheckSquare />
                        </div>
                      );
                    }
                  })()}
                </div>
              );
            })}
          </div>
          <div
            className="default-btn"
            style={{
              width: "fit-content",
            }}
            onClick={function () {
              if (labelName) {
                let newLabel = {
                  id: genID(),
                  name: labelName,
                  bg: activeBg,
                };
                addLabel(newLabel);
                setActiveBg(globalColors[0]);
                setLabelName("");
              }
            }}
            disabled={labelName ? false : true}
          >
            <span>Save</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export function Labels(props) {
  const { card } = props;
  let _card = useSelector(function (state) {
    return state.cards.filter(function (selected_card) {
      if (selected_card.id === card.id) {
        return selected_card;
      }
    });
  })[0];
  let labels = useSelector(function (state) {
    return state.cardLabels.filter(function (label) {
      if (_card.labels) {
        if (_card.labels.indexOf(label.id) !== -1) {
          return label;
        }
      }
    });
  });
  let dispatch = useDispatch();
  function Label(props) {
    const { label } = props;

    // selectors
    const _label = useSelector(function (state) {
      for (let selectedLabel of state.cardLabels) {
        if (label.id === selectedLabel.id) {
          return selectedLabel;
        }
      }
    });

    return _label ? (
      <div
        className="label"
        style={{
          background: _label.bg,
        }}
      >
        {_label.name ? (
          <span className="label-name" style={{ color: "white" }}>
            {_label.name}
          </span>
        ) : (
          ""
        )}
        <div
          className="del-lab"
          onClick={function () {
            let labels = [
              ..._card.labels.filter(function (__label) {
                if (__label !== _label.id) {
                  return __label;
                }
              }),
            ];
            editCard({ ...card, labels }, dispatch);
          }}
        >
          <FiX />
        </div>
      </div>
    ) : (
      ""
    );
  }
  return labels.length !== 0 ? (
    <div className="labels">
      {labels.map(function (label, index) {
        return <Label label={label} key={index}></Label>;
      })}{" "}
    </div>
  ) : (
    ""
  );
}
export function Checklist(props) {
  const { checklist } = props;
  // Selectors

  const _checklist = useSelector(function (state) {
    for (const check of state.cardChecklists) {
      if (check.id === checklist.id) {
        return check;
      }
    }
  });
  const checklistItems = useSelector(function (state) {
    return state.checklistItems.filter(function (item) {
      if (item.checklist_id === _checklist.id) {
        return item;
      }
    });
  });
  const checkedItems = useSelector(function (state) {
    return state.checklistItems.filter(function (item) {
      if (item.checklist_id === _checklist.id && item.checked) {
        return item;
      }
    });
  });

  // states
  const [editingChecklist, seteditingChecklist] = useState(false);
  const { error, setError } = useContext(ErrorContext);
  // usefull functions
  function Item(props) {
    let item = useSelector(function name(state) {
      return state.checklistItems.filter(function (_item) {
        if (props.item.id === _item.id) {
          return _item;
        }
      });
    })[0];
    let [editingItem, setEditingItem] = useState(false);
    let [itemName, setItemName] = useState(item.name);
    return (
      <div
        className="checklist-item"
        style={{
          padding: editingItem ? "0px" : "10px",
          display: "flex",
        }}
      >
        {editingItem ? (
          <input
            type="text"
            className="item-input"
            onChange={function (e) {
              let name = e.currentTarget.value;
              setItemName(name);
            }}
            value={itemName}
            placeholder="Item name..."
            onKeyDown={function (e) {
              let key = e.key;
              if (key === "Enter") {
                editItem({ ...item, name: itemName });
                setEditingItem(!editItem);
              }
            }}
          />
        ) : (
          <div className="item-infos">
            <span>
              <input
                type="checkbox"
                checked={item.checked || false}
                onChange={function (e) {
                  let checked = e.currentTarget.checked;
                  editItem({ ...item, checked });
                }}
              />{" "}
            </span>
            <p
              onClick={function () {
                setEditingItem(!editingItem);
              }}
            >
              {item.name}
            </p>
            <div className="del-item">
              <span
                onClick={function () {
                  dispatch(checklistItemsSlice.actions.delItem(item));
                }}
              >
                {" "}
                <FiTrash />
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
  function editItem(newItem) {
    let item = {};
    for (let key in newItem) {
      if (key !== "_id") {
        item[key] = newItem[key];
      }
    }
    greberDB.databases.checklistItems.update(
      { id: newItem.id },
      { $set: item },
      {},
      function (err, numReplaced) {
        if (!err) {
          dispatch(checklistItemsSlice.actions.editItem(newItem));
        } else {
          setError(err);
        }
      }
    );
  }

  function editChecklist(new_checklist) {
    greberDB.databases.cardChecklists.update(
      { id: new_checklist.id },
      { $set: new_checklist },
      {},
      function (err, numReplaced) {
        if (!err) {
          dispatch(cardChecklistsSlice.actions.editChecklist(new_checklist));
        } else {
          setError(err);
        }
      }
    );
  }
  const dispatch = useDispatch();
  return (
    <div className="checklist">
      <p className="created_at">{moment(_checklist.created_at).calendar()}</p>
      <div className="checklist-header">
        {editingChecklist ? (
          <span className="editing-checklist">
            <FiCheckSquare></FiCheckSquare>
            <input
              type="text"
              placeholder="Edit checklist name..."
              onKeyDown={function (e) {
                let key = e.key;
                if (key === "Enter") {
                  let new_checklist = {
                    ...checklist,
                    name: e.currentTarget.value,
                  };
                  editChecklist(new_checklist);
                  seteditingChecklist(!editingChecklist);
                }
              }}
            />
            <span
              onClick={function () {
                seteditingChecklist(!editingChecklist);
              }}
            >
              <FiXCircle />
            </span>
          </span>
        ) : (
          <span
            onClick={function () {
              seteditingChecklist(!editingChecklist);
            }}
          >
            <FiCheckSquare /> {_checklist.name}
          </span>
        )}
      </div>

      <div className="progress-bar">
        <span className="percent">
          {((checkedItems.length / checklistItems.length) * 100 || 0).toFixed(
            1
          ) + "%"}
        </span>
        <div
          className="bar"
          style={{
            width: (checkedItems.length / checklistItems.length) * 100 + "%",
          }}
        ></div>
      </div>
      <div className="checklist-items">
        {checklistItems
          .sort((a, b) => a.queue - b.queue)
          .map(function (item, index) {
            return <Item item={item} key={index}></Item>;
          })}
      </div>

      <div
        className="add-item"
        style={{
          textAlign: "center",
        }}
        onClick={function () {
          let newItem = {
            id: Math.floor(Math.random() * 10 ** 9),
            name: "My Item",
            checklist_id: checklist.id,
            created_at: moment(new Date()).calendar(),
            queue: checklistItems.length + 1,
          };
          greberDB.databases.checklistItems.insert(newItem, function (err) {
            if (!err) {
              dispatch(checklistItemsSlice.actions.addItem(newItem));
            } else {
              setError(err);
            }
          });
        }}
      >
        <FiPlus /> Add item
      </div>
      <div
        className="add-item danger"
        style={{
          textAlign: "center",
        }}
        onClick={function () {
          editChecklist({
            ...checklist,
            removed: true,
          });
        }}
      >
        <FiTrash /> Remove
      </div>
    </div>
  );
}
export const Checklists = React.memo(
  function Checklists(props) {
    const { checklists } = props;

    return checklists.length ? (
      <div className="card-checklists">
        {checklists
          .sort((a, b) => a.queue - b.queue)
          .map(function (checklist, index) {
            return <Checklist checklist={checklist} key={index} />;
          })}
      </div>
    ) : (
      ""
    );
  },
  function (left, right) {
    return left.checklists.length === right.checklists.length;
  }
);

export function Attachments(props) {
  // NOTICE: The Attachments feature may not be implemented because the files are not stable in the user
  // directory (can be removed or replaced)
  return (
    <div className="attachments">
      <h3>Attachments</h3>
    </div>
  );
}
export function Deadline(props) {
  const { card } = props;

  let _card = useSelector(function (state) {
    for (let __card of state.cards) {
      if (__card.id === card.id) {
        return __card;
      }
    }
  });

  // states
  let [editing, setEditing] = useState(false);
  let [selectedDate, setSelectedDate] = useState(new Date(_card.deadline));
  let dispatch = useDispatch();

  return _card.deadline ? (
    editing ? (
      <div className="editing-deadline">
        <input
          type="datetime-local"
          value-as-date={selectedDate}
          onInput={function (e) {
            let value = new Date(e.currentTarget.value);
            setSelectedDate(value);
          }}
        />
        <button
          className="add-act-btn"
          onClick={function (e) {
            editCard(
              {
                ..._card,
                deadline: selectedDate.toISOString(),
              },
              dispatch
            );

            setEditing(false);
          }}
        >
          Save
        </button>
        <span
          onClick={function () {
            setEditing(false);
          }}
        >
          <FiX />
        </span>
      </div>
    ) : (
      <div
        className="deadline"
        onClick={function () {
          setEditing(true);
        }}
        style={{
          backgroundColor:
            new Date(_card.deadline).getTime() > new Date().getTime()
              ? "#71fb71"
              : "#FF2E63",
        }}
      >
        <span>
          <FiClock /> {moment(_card.deadline).calendar()} ,{" "}
          {new Date(_card.deadline).getHours()}:
          {new Date(_card.deadline).getMinutes()}
        </span>
      </div>
    )
  ) : (
    ""
  );
}

export function CardOptions(props) {
  let { ["card"]: _card } = props;
  let [labelDropdownActive, setLabelDropdownActive] = useState(false);
  let [activeBg, setActiveBg] = useState(_card.bg || "white");
  let [cardBgs] = useState(globalColors);
  let checklists = useSelector(function (state) {
    return state.cardChecklists.filter(function (checklist) {
      if (checklist.card_id === _card.id && !checklist.removed) {
        return checklist;
      }
    });
  });
  let dispatch = useDispatch();

  useEffect(
    function () {
      editCard(
        {
          ..._card,
          bg: activeBg,
        },
        dispatch
      );
    },
    [activeBg]
  );
  return (
    <div className="card-editor-options">
      <h3>
        <i className="fas fa-pen-square"></i> Customize
      </h3>
      <div className="card-options">
        <div
          className="card-option"
          onClick={function () {
            setLabelDropdownActive(true);
          }}
        >
          <span>
            <FiTag /> Labels
          </span>
        </div>
        {labelDropdownActive ? (
          <LabelsDropdown
            card={_card}
            setLabelDropdownActive={setLabelDropdownActive}
            labelDropdownActive={labelDropdownActive}
          />
        ) : (
          ""
        )}
        <div
          className="card-option"
          onClick={function () {
            let newCardChecklist = {
              id: Math.floor(Math.random() * 10 ** 9),
              name: "New Checklist",
              card_id: _card.id,
              queue: checklists.length + 1,
              created_at: new Date(),
            };
            greberDB.databases.cardChecklists.insert(
              newCardChecklist,
              function (err) {
                if (!err) {
                  dispatch(
                    cardChecklistsSlice.actions.addChecklist(newCardChecklist)
                  );
                } else {
                  setError(err);
                }
              }
            );
          }}
        >
          <span>
            <FiCheckSquare /> Checklist
          </span>
        </div>
        <div
          className="card-option"
          onClick={function () {
            if (!_card.deadline) {
              let to = new Date();
              to.setHours(to.getHours() + 24);
              let newCard = {
                ..._card,
                deadline: to,
              };
              editCard(newCard, dispatch);
            } else {
              let newCard = {
                ..._card,
                deadline: undefined,
              };
              editCard(newCard, dispatch);
            }
          }}
        >
          <span>
            <FiClock /> {!_card.deadline ? "Add deadline" : "Remove deadline"}
          </span>
        </div>

        <div
          className="card-option danger"
          onClick={function () {
            removeCard(_card, dispatch);
          }}
        >
          <span>
            <FiTrash /> Delete
          </span>
        </div>
      </div>
      <br />
      <div className="board-bg">
        <h3
          style={{
            paddingBottom: "10px",
          }}
        >
          Background
        </h3>
        <div className="bg-list">
          {cardBgs.map(function (bg, index) {
            return (
              <div
                className="bg"
                key={index}
                style={{
                  background: bg,
                }}
                onClick={function () {
                  setActiveBg(bg);
                }}
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
  );
}

export function ActivityList({ cardActivity }) {
  return (
    <div className="card-activity">
      {cardActivity
        .sort((a, b) => a.queue - b.queue)
        .map(function (act, index) {
          return <Activity activity={act} key={index}></Activity>;
        })}
    </div>
  );
}

export function ActivityInput(props) {
  let { cardActivity, card } = props;
  let [actInput, setActInput] = useState("");
  let dispatch = useDispatch();
  return (
    <div className="add-activity">
      <input
        type="text"
        onInput={function (e) {
          let value = e.currentTarget.value;
          setActInput(value);
        }}
        placeholder="Add Activity..."
        value={actInput}
      />

      {actInput ? (
        <div className="activity-options">
          <div
            className="add-act-btn"
            onClick={function () {
              let newAct = {
                id: Math.floor(Math.random() * 1000000),
                card_id: card.id,
                name: actInput,
                created_at: new Date(),
                queue: cardActivity.length + 1,
              };
              greberDB.databases.cardActivity.insert(newAct, function (err) {
                if (!err) {
                  dispatch(cardActivityslice.actions.addActivity(newAct));
                  setActInput("");
                } else {
                  setError(err);
                }
              });
            }}
          >
            <span>
              <FiPlus /> Add
            </span>
          </div>

          <div className="addons">
            <span className="addon">
              <FiPaperclip />
            </span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export function CardActivity({ card }) {
  let cardActivity = useSelector(
    function (state) {
      return state.cardActivity.filter(function (act) {
        if (act.card_id === card.id && !act.removed) {
          return act;
        }
      });
    },
    function (left, right) {
      return left.length === right.length;
    }
  );
  return (
    <div className="card-activity">
      <h3>
        <FiAlignLeft /> Activity
      </h3>
      <div className="activity-list">
        <ActivityInput cardActivity={cardActivity} card={card} />
        <ActivityList cardActivity={cardActivity} />
      </div>
    </div>
  );
}

export function CardDesc(props) {
  let { card } = props;
  let dispatch = useDispatch();
  let [cardDesc, setCardDesc] = useState(card.desc);
  let [descFocused, setDescFocus] = useState(false);
  let _card = useSelector(function (state) {
    for (let __card of state.cards) {
      if (__card.id === card.id) {
        return __card;
      }
    }
  });
  return (
    <div className="card-desc">
      <h3>
        <FiMessageCircle /> Card Description
      </h3>
      <br />
      <textarea
        placeholder="Card Description..."
        value={cardDesc}
        onChange={function (e) {
          setCardDesc(e.currentTarget.value);
        }}
        onFocus={function () {
          setDescFocus(true);
        }}
      ></textarea>
      {descFocused ? (
        <div
          style={{
            display: "flex",
            gap: "5px",
            alignItems: "center",
          }}
        >
          <div
            className="add-act-btn"
            onClick={function (e) {
              let new_card = { ..._card, desc: cardDesc };
              editCard(new_card, dispatch);

              setDescFocus(!descFocused);
            }}
          >
            <span>Save</span>
          </div>
          <span
            style={{
              fontSize: "20px",
              color: "var(--theme1-blue)",
              opacity: ".7",
              cursor: "pointer",
            }}
            onClick={function () {
              setDescFocus(!descFocused);
              setCardDesc(_card.desc);
            }}
          >
            <FiX />
          </span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
// Main Component
function CardEditor(props) {
  const { card } = props;
  // selectors
  let _card = useSelector(function (state) {
    return state.cards.filter(function (selected_card) {
      if (selected_card.id === card.id) {
        return selected_card;
      }
    });
  })[0];
  // states
  let checklists = useSelector(function (state) {
    return state.cardChecklists.filter(function (checklist) {
      if (checklist.card_id === _card.id && !checklist.removed) {
        return checklist;
      }
    });
  });

  const dispatch = useDispatch();
  return (
    <ModalContainer
      setModalActive={function () {
        dispatch({
          type: "cardEditor/setInActive",
        });
      }}
    >
      <div className="modal card-editor">
        <div className="card-cover">
          <img src={_card.img ? getCoverPath(_card.img) : cardBg} alt="" />

          <span
            className={"bg-edit-btn"}
            onClick={async function () {
              await removeCover(_card.img);

              let img = await uploadCover(_card.id);

              console.log(img);
              if (!img.canceled) {
                console.log("not canceled");
                editCard(
                  {
                    ..._card,
                    img: _card.id,
                  },
                  dispatch
                );
              }
            }}
          >
            <MdEdit />
          </span>
        </div>
        <div className="card-editor-body">
          <div className="card-editor-infos">
            <Labels card={card}></Labels>
            <div className="card-editor-title">
              <h3
                style={{
                  fontSize: "x-large",
                }}
              >
                <FiFile /> {_card.name}
              </h3>
            </div>
            {/* Deadline of the card */}
            {<Deadline card={_card}></Deadline>}
            {/* Put here the configurations of the Card (checklists, etc...)*/}
            <CardDesc card={card} />
            <Checklists checklists={checklists} />

            <CardActivity card={card} />
          </div>
          <CardOptions card={_card} />
        </div>
      </div>
    </ModalContainer>
  );
}

export default CardEditor;
