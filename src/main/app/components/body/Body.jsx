import React from "react";
import { useSelector } from "react-redux";

// pages for routing
import HomePage from "./HomePage.jsx";
import Project from "../project/Project.jsx";
import ProjectsList from "../project/ProjectsList.jsx";
import Settings from "../settings/Settings.jsx";
import Garbage from "../garbage/Garbage.jsx";
import Calendar from "../calendar/Calendar.jsx";
export const pages = {
  homePage: function (props = {}) {
    return <HomePage {...props}></HomePage>;
  },
  projectPage: function (props = {}) {
    return <Project {...props}></Project>;
  },
  projectsListPage: function (props = {}) {
    return <ProjectsList {...props}></ProjectsList>;
  },
  settings: function (props = {}) {
    return <Settings {...props}></Settings>;
  },

  garbage: function (props = {}) {
    return <Garbage {...props}></Garbage>;
  },
  calendar: function (props = {}) {
    return <Calendar {...props} />;
  },
};

export default function Body(props) {
  const activeRouter = useSelector(function (state) {
    return state.router.activeRouter;
  });

  return <div className="body">{pages[activeRouter]()}</div>;
}
