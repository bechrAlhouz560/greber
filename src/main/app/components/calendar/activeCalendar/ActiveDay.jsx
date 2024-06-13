import React, { createContext, useContext } from "react";
import { useRef } from "react";
import { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { EventModal } from "../event/EventModal.jsx";
import styles from "./active-day.module.css";

export const ActiveModal = createContext({
  activeEventModal: {
    element: null,
    hour: null,
  },
  setActiveEventModal: () => {},
});

export function Hour({ hour, activeDay }) {
  const h = hour.split(/(am|pm)/g)[0];
  const { activeEventModal, setActiveEventModal } = useContext(ActiveModal);
  const element = useRef();

  return (
    <div
      className={styles["main-calendar-day"]}
      ref={element}
      onClick={function () {
        setActiveEventModal({
          element,
          hour: h,
        });
      }}
    >
      <span>{hour}</span>
    </div>
  );
}

export default function ActiveDay({ activeDay, setActiveDay }) {
  const houres = [
    "00am",
    "01am",
    "02am",
    "03am",
    "04am",
    "05am",
    "06am",
    "07am",
    "08am",
    "09am",
    "10pm",
    "11pm",
    "12pm",
    "13pm",
    "14pm",
    "15pm",
    "16pm",
    "17pm",
    "18pm",
    "19pm",
    "20pm",
    "21pm",
    "22pm",
    "23pm",
  ];
  const [activeEventModal, setActiveEventModal] = useState(null);
  return (
    <ActiveModal.Provider value={{ activeEventModal, setActiveEventModal }}>
      <div className={styles["active-day"]}>
        <div className={styles["head"]}>
          <div
            onClick={() => setActiveDay(null)}
            className={styles["switch"]}
            style={{ marginRight: 10 }}
          >
            <AiOutlineArrowLeft />
          </div>
          <span>{activeDay.toDateString()}</span>
        </div>

        <div className={styles["body"]}>
          <div className={styles["main-calendar-grid"]}>
            {houres.map((n, i) => (
              <Hour hour={n} activeDay={activeDay} key={i} />
            ))}
          </div>
        </div>

        {activeEventModal ? (
          <EventModal hour={activeEventModal.hour} activeDay={activeDay} />
        ) : null}
      </div>
    </ActiveModal.Provider>
  );
}
