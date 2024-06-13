import React from "react";
import ProjectCard from "./ProjectCard.jsx";
export default function ProjectCardsContainer({ projects }) {
  return (
    <div className="project-card-container">
      {(function () {
        if (projects.length !== 0) {
          return projects.map(function (project, index) {
            return <ProjectCard infos={project} key={index} />;
          });
        } else {
          return (
            <div className="empty">
              <div className="message">No Saved Projects</div>
            </div>
          );
        }
      })()}
    </div>
  );
}
