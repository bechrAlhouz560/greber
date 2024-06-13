import React, { useState } from "react";
import styles from "./calendar.module.css";
import { BiCalendar } from "react-icons/bi";

import moment from "moment";
import CalendarMain from "./calendarMain/CalendarMain.jsx";

export function EventDiv() {
  return (
    <div className={styles["event"]}>
      <div className={styles["event-head"]}>
        <div className={styles["event-color"]}></div>
        <span style={{ fontSize: 12, color: "#585858" }}>
          {moment(new Date()).calendar()}
        </span>
      </div>
      <div className={styles["event-body"]}>
        <span className={styles["event-title"]}>Meeting with a client</span>
        <span className={styles["event-desc"]}>
          tell how to boost website traffic
        </span>
      </div>
    </div>
  );
}

export function CalendarSideBar() {
  return (
    <div className={styles["sidebar"]}>
      <div className={styles["title"]}>
        <h1>
          <BiCalendar /> <span>Calendar</span>
        </h1>
        <p>make scheduled events and manage them</p>
      </div>

      <div className={styles["sidebar-body"]}>
        <h2 style={{ paddingBottom: 10 }}>Upcoming Events</h2>
        <EventDiv />
        <EventDiv />
        <EventDiv />
        <h2 style={{ padding: 10 }}>Expired Events</h2>
        <EventDiv />
        <EventDiv />
        <EventDiv />
      </div>
    </div>
  );
}

export function CalendarBody() {
  // the calendar type (day, month or week)
  return (
    <div className={styles["body"]}>
      <div className={styles["calendar-top"]}></div>
      <CalendarMain />
    </div>
  );
}
export default function Calendar() {
  return (
    <div className={styles["calendar"]}>
      <CalendarSideBar />
      <CalendarBody />
    </div>
  );
}
