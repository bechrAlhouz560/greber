import React from "react";
import { useSelector } from "react-redux";

import ProjectCardsContainer from "../project/ProjectCardsContainer.jsx";
import styles from "./homepage.module.css";
import { FiClock, FiHeart } from "react-icons/fi";

export function renderProjects(projects) {
  let sorted = {};

  let elements = [];
  for (let p of projects) {
    if (p.lastOpened) {
      let date = new Date(p.lastOpened)
        .toISOString()
        .split("T")[0]
        .replace(/\-/g, "/");
      try {
        sorted[date].push(p);
      } catch {
        sorted[date] = [p];
      }
    }
  }

  let index = 0;
  for (const date in sorted) {
    elements.push(
      <p className={styles["date"]} key={index}>
        {date}
      </p>
    );

    elements.push(
      <ProjectCardsContainer projects={sorted[date]} key={index + 1} />
    );
    index++;
  }

  return elements;
}
//  Old HomePage
export default function HomePage() {
  let recentProjects = useSelector(function (state) {
    return state.projects.projects.filter(function (project) {
      let found = state.recentProjects.indexOf(project.id);

      return found > -1 && project.removed !== true;
    });
  });
  let savedProjects = useSelector(function (state) {
    return state.projects.projects.filter(function (project) {
      let found = state.savedProjects.indexOf(project.id);

      return found > -1 && project.removed !== true;
    });
  });

  return (
    <div className={styles["home-page"]}>
      <div className={styles["home-page-body"]}>
        <div className={styles["body-container"]}>
          <div className={styles["home-page-section"]}>
            <h1 className={styles["header"]}>
              <FiClock /> Recently Opened
            </h1>
            {renderProjects(recentProjects)}
          </div>
          <div className={styles["home-page-section"]}>
            <br />
            <h1 className={styles["header"]}>
              <FiHeart /> Saved
            </h1>
            {renderProjects(savedProjects)}
          </div>
        </div>
      </div>
    </div>
  );
}

// New HomePage

// export function HomePage () {
//     return <h1>Hello To New Greber Version</h1>
// }
