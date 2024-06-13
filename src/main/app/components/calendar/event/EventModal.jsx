import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { globalColors } from "../../../../utils/globals";
import styles from "./event-modal.module.css";
import { ActiveModal } from "../activeCalendar/ActiveDay.jsx";
import { useRef } from "react";
import greberDB from "../../../db/main";
import { genID } from "../../board/list/List.jsx";
import eventSlice from "../../../features/event/eventSlice";
import store from "../../../store";

export function BgList({ activeBg, onClick }) {
  return (
    <div className="bg-list">
      {globalColors.slice(0, 6).map(function (bg, index) {
        return (
          <div
            className="bg"
            key={index}
            style={{
              background: bg,
            }}
            onClick={() => onClick(bg)}
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
  );
}

export function addEvent(event) {
  return new Promise(function (resolve, reject) {
    const _event = {
      id: genID(),
      ...event,
      created_at: new Date(),
    };
    greberDB.databases.events.insert(event, function (err) {
      if (!err) {
        const action = eventSlice.actions.addEvent(event);
        store.dispatch(action);
        resolve(event);
        return;
      }
      reject(err);
    });
  });
}
export function EventModal({ hour, activeDay }) {
  const [right, setRight] = useState(false);
  const [activeBg, setActiveBg] = useState(globalColors[0]);
  const { activeEventModal, setActiveEventModal } = useContext(ActiveModal);
  const ref = useRef();
  const [offset, setOffset] = useState([0, 0]);

  const [duration, setDuration] = useState([
    Number(activeEventModal.hour),
    Number(activeEventModal.hour) + 1,
  ]);
  const [title, setTitle] = useState("");
  useEffect(
    function () {
      setOffset([
        activeEventModal.element.current.offsetLeft,
        activeEventModal.element.current.offsetTop,
      ]);
      setRight((Number(activeEventModal.hour) + 1) % 7 === 0);
    },
    [activeEventModal.hour]
  );

  return (
    <div
      className={styles["event-modal"]}
      ref={ref}
      style={{
        right: right ? activeEventModal.element.current.offsetWidth + 20 : null,
        left: right ? null : offset[0],
        top: offset[1],
      }}
    >
      <div className={styles["event-head"]}>
        <h2>Create Event</h2>
        <span onClick={() => setActiveEventModal(null)}>
          <FiX />
        </span>
      </div>
      <div className={styles["event-body"]}>
        <input
          className="g-input"
          placeholder="Event title"
          type={"text"}
          onChange={({ currentTarget: { value } }) => setTitle(value)}
          value={title}
          style={{ width: "100%" }}
        />
        <br />
        <br />
        from{" "}
        <input
          type="number"
          className="g-input"
          style={{ width: 100 }}
          step={0.1}
          value={duration[0]}
          min={Number(activeEventModal.hour)}
          max={Number(activeEventModal.hour) + 1 - 0.1}
          onChange={({ currentTarget: { value } }) =>
            setDuration([value, duration[1]])
          }
        />
        to{" "}
        <input
          type="number"
          className="g-input"
          min={Number(activeEventModal.hour) + 1}
          max={23}
          step={0.1}
          style={{ width: 100 }}
          value={duration[1]}
          onChange={({ currentTarget: { value } }) =>
            setDuration([duration[0], value])
          }
        />
        <br />
        <br />
        <BgList activeBg={activeBg} onClick={setActiveBg} />
        <br />
        <div
          className="g-btn g-btn-rounded"
          onClick={() => {
            addEvent({ duration, title, bg: activeBg }).then(function (event) {
              console.log(event);
              setActiveEventModal(null);
            });
          }}
        >
          <span>save</span>
        </div>
      </div>
    </div>
  );
}
