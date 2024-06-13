import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import greberDB from "../../db/main.js";

import ProjectCard from "./ProjectCard.jsx";
import styles from "./project.module.css";
// import { FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';
import {
  AiFillProject,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";

export function sortType(type) {
  if (type === "alpha-asc") {
    return undefined;
  } else {
    return function (a, b) {
      switch (type) {
        case "time":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );

        default:
          return a.queue - b.queue;
      }
    };
  }
}
export default function Projectslist() {
  const projects = useSelector(function (state) {
    return state.projects.projects.filter(function (project) {
      if (!project.removed) {
        return project;
      }
    });
  });

  const [srchTxt, setSrchTxt] = useState("");
  const [result, setResult] = useState([]);
  const [sortBy, setSortBy] = useState("time");
  useEffect(() => {
    if (srchTxt) {
      greberDB.databases.projects.find(
        {
          name: {
            $regex: new RegExp(srchTxt, "i"),
          },
        },
        function (err, docs) {
          if (!err) {
            setResult(docs);
          } else {
            console.log(err);
          }
        }
      );
    } else {
      setResult([]);
    }
  }, [srchTxt]);

  return (
    <div className={styles["projects-list"]}>
      <div className={styles["list-h"]}>
        <h1>
          <AiFillProject /> Projects
        </h1>
        <div className={styles["srch"]}>
          <input
            type="text"
            placeholder="Search here..."
            value={srchTxt}
            onChange={function (e) {
              let value = e.currentTarget.value;

              setSrchTxt(value);
            }}
          />
        </div>

        <div className={styles["sorting"]}>
          <span
            className={
              styles["sort-type"] +
              " " +
              (sortBy === "alpha-asc" ? styles["sort-active"] : "")
            }
            onClick={function () {
              setSortBy("alpha-asc");
            }}
          >
            {" "}
            <AiOutlineSortAscending />
          </span>
          <span
            className={
              styles["sort-type"] +
              " " +
              (sortBy === "alpha-desc" ? styles["sort-active"] : "")
            }
            onClick={function () {
              setSortBy("alpha-desc");
            }}
          >
            {" "}
            <AiOutlineSortDescending />
          </span>
          <span
            className={
              styles["sort-type"] +
              " " +
              (sortBy === "time" ? styles["sort-active"] : "")
            }
            onClick={function () {
              setSortBy("time");
            }}
          >
            {" "}
            T{" "}
          </span>
        </div>
      </div>
      <div className={styles["list-body"]}>
        {!srchTxt ? (
          projects.length !== 0 ? (
            projects
              .sort(sortType(sortBy))
              [sortBy === "alpha-asc" ? "reverse" : "map"](function (project) {
                return project;
              })
              .map(function (project, index) {
                return <ProjectCard infos={project} key={index} />;
              })
          ) : (
            <div className={styles["not-found"]}>
              <h1>No Project Found</h1>
            </div>
          )
        ) : (
          (function () {
            if (result.length !== 0) {
              return result.map(function (project, index) {
                return <ProjectCard infos={project} key={index} />;
              });
            }
            return (
              <div className={styles["not-found"]}>
                <h1>No Result Found</h1>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
}
