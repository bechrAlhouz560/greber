import React, { useState } from "react";
import styles from "./main-calendar.module.css";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import moment from "moment";
import ActiveDay from "../activeCalendar/ActiveDay.jsx";
import { useSelector } from "react-redux";

function createCalendar(year, month) {
  let calendar = [];
  const today = moment().set("year", year).set("month", month);
  const startDay = today.clone().startOf("month").startOf("week");
  const endDay = today.clone().endOf("month").endOf("week");

  let date = startDay.clone().subtract(1, "day");

  while (date.isBefore(endDay, "day"))
    calendar = [
      ...calendar,
      ...Array(7)
        .fill(0)
        .map(() => date.add(1, "day").clone().toDate()),
    ];
  return calendar;
}
/**
 *
 * @param {Array} cards
 * @param {Date} date
 * @returns {Array}
 */
export function getEventByDate(cards, date) {
  const day = date.toDateString();

  return cards.filter(function (card) {
    if (card.deadline) {
      const cardDate = new Date(card.deadline).toDateString();
      return day === cardDate;
    }
  });
}
/**
 *
 * @param {Date} date
 * @return {[Date,Date]}
 */
function checkMonthDate(date) {
  const isThisMonth =
    moment().month() === date.getMonth() &&
    moment().year() === date.getFullYear();
  const isThisDay = isThisMonth && moment().get("date") === date.getDate();

  return [isThisMonth, isThisDay];
}
export function Day({ date, setActiveDay }) {
  const events = useSelector((state) => getEventByDate(state.events, date));
  return (
    <div
      className={styles["main-calendar-day"]}
      style={{
        backgroundColor: checkMonthDate(date)[1] ? "var(--theme1-blue)" : null,
        opacity: checkMonthDate(date)[0] ? 1 : 0.5,
        color: checkMonthDate(date)[1] ? "white" : null,
      }}
      onClick={() => {
        setActiveDay(date);
      }}
    >
      <div className={styles["cal-day-head"]}>
        <span>{date.toDateString().split(" ")[2]}</span>
      </div>

      <div className={styles["cal-day-body"]}>
        {events.map((c) => (
          <div
            className={styles["card-day"]}
            style={{ background: c.bg || "var(--theme1-blue)" }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default function CalendarMain({ calType }) {
  const weekDays = moment.weekdaysShort();

  const [curDate, setDate] = useState([moment().month(), moment().year()]);

  const [activeDay, setActiveDay] = useState();

  function prev() {
    if (curDate[0] === 0) {
      setDate([11, curDate[1] - 1]);
    } else {
      setDate([curDate[0] - 1, curDate[1]]);
    }
  }

  function today() {
    const d = moment();
    setDate([d.month(), d.year()]);
  }
  function next() {
    if (curDate[0] === 11) {
      setDate([0, curDate[1] + 1]);
    } else {
      setDate([curDate[0] + 1, curDate[1]]);
    }
  }
  return (
    <div className={styles["calendar-body"]}>
      <div className={styles["calendar-head"]}>
        <h1 style={{ color: "#228ed9" }}>
          {moment.months(curDate[0]) + " " + curDate[1]}
        </h1>

        <div className={styles["options"]}>
          <div className={styles["calendar-switches"]}>
            <div className={styles["switch"]} onClick={prev}>
              <span>
                <AiOutlineArrowLeft />
              </span>
            </div>
            <div className={styles["switch"]} onClick={today}>
              <span>Today</span>
            </div>
            <div className={styles["switch"]} onClick={next}>
              <span>
                <AiOutlineArrowRight />
              </span>
            </div>
          </div>
        </div>
      </div>
      {!activeDay ? (
        <div className={styles["main-calendar"]}>
          <div className={styles["main-calendar-head"]}>
            {weekDays.map((day, index) => (
              <div key={index} className={styles["main-calendar-item"]}>
                <span>{day}</span>
              </div>
            ))}
          </div>
          <div className={styles["main-calendar-grid"]}>
            {createCalendar(curDate[1], curDate[0]).map((e, index) => (
              <Day key={index} date={e} setActiveDay={setActiveDay} />
            ))}
          </div>
        </div>
      ) : (
        <ActiveDay activeDay={activeDay} setActiveDay={setActiveDay} />
      )}
    </div>
  );
}
