import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./navbar.css";
import img from "../../../../assets/1x/logo_min.png";
import ProjectCard from "../project/ProjectCard.jsx";
import routerSlice from "../../features/router/routerSlice";
import {
  FiDatabase,
  FiFolderPlus,
  FiHeart,
  FiPlus,
  FiTrash,
} from "react-icons/fi";
import { IoIosArrowDropdown } from "react-icons/io";
import { BsLayoutTextWindowReverse } from "react-icons/bs";
import { ipcRenderer } from "electron";
import { CiStickyNote } from "react-icons/ci";
import { AiFillProject, AiOutlineHeart } from "react-icons/ai";
import { RiCalendarTodoFill } from "react-icons/ri";
import { MdBackup } from "react-icons/md";

export function DropdownItem(props) {
  const { item } = props;
  return (
    <div className="dropdown-item" onClick={item.onClick}>
      <span>
        {item.icon} {item.name}
      </span>
    </div>
  );
}

export function DropDown(props) {
  const { items, children } = props;
  return (
    <div className="dropdown-content">
      <div className="content">{children}</div>
      {items.map(function (value, index) {
        return <DropdownItem item={value} key={index}></DropdownItem>;
      })}
    </div>
  );
}
export function NavItem(props) {
  const { item, children } = props;
  function Dropdown() {
    if (item.dropdown) {
      return <DropDown items={item.dropdown}>{children}</DropDown>;
    } else {
      return "";
    }
  }
  return (
    <div className="nav-item dropdown" onClick={item.onClick}>
      <p>
        {item.icon} {item.name}{" "}
        <span style={{ marginLeft: 5 }}>
          {!item.dropdown || <IoIosArrowDropdown />}
        </span>
      </p>
      <Dropdown />
    </div>
  );
}

export function ProjectListCard({ projects }) {
  if (projects.length !== 0) {
    return projects
      .slice(0, 4)
      .sort((a, b) => a.queue - b.queue)
      .map(function (project, index) {
        return <ProjectCard infos={project} key={index} />;
      });
  }
  return (
    <div className="empty">
      <div className="msg">No Project Found</div>
    </div>
  );
}
export default function NavBar(props) {
  const { setModalActive, setModalType } = props;
  const dispatch = useDispatch();
  const [navItems] = useState([
    {
      icon: <AiFillProject />,
      name: "Projects",
      content: function () {
        let projects = useSelector((state) => {
          return state.projects.projects.filter(function (project) {
            if (!project.removed) {
              return project;
            }
          });
        });

        return (
          <div className="projects">
            <h2 className="projects-header">
              <AiFillProject /> Projects
            </h2>

            <ProjectListCard projects={projects} />
          </div>
        );
      },
      dropdown: [
        {
          icon: <FiPlus />,
          name: "Create Project",
          onClick: function () {
            setModalType("projectModal");
            setModalActive(true);
          },
        },
        {
          icon: <FiFolderPlus />,
          name: "View More",
          onClick: function () {
            dispatch(routerSlice.actions.setActiveRouter("projectsListPage"));
          },
        },
      ],
    },
    {
      icon: <AiOutlineHeart />,
      name: "Saved",
      content: function () {
        let projects = useSelector((state) => {
          return state.projects.projects.filter(function (project) {
            let found = state.savedProjects.indexOf(project.id);

            return found > -1 && project.removed !== true;
          });
        });
        return (
          <div className="projects">
            <h2 className="projects-header">
              <FiHeart /> Saved
            </h2>
            <ProjectListCard projects={projects} />
          </div>
        );
      },
      dropdown: [],
    },
    // {
    //   icon: <RiCalendarTodoFill />,
    //   name: "Calendar",
    //   onClick: function () {
    //     dispatch(routerSlice.actions.setActiveRouter("calendar"));
    //   },
    // },
  ]);

  const [secondNavItems] = useState([
    {
      icon: <CiStickyNote />,
      onClick: function () {
        ipcRenderer.send("open-notepad");
      },
    },
    // {
    //   icon: <BsLayoutTextWindowReverse />,
    //   onClick: function () {
    //     console.log("coming soon");
    //   },
    // },
    // {
    //     icon : <FiDatabase />,
    //     onClick : function () {
    //         setModalType('encryptionModal');
    //         setModalActive(true)
    //     }
    // },
    {
      icon: <FiTrash />,
      onClick: function () {
        dispatch(routerSlice.actions.setActiveRouter("garbage"));
      },
    },
    // {
    //   icon: <MdBackup />,
    //   onClick: function () {
    //     dispatch(routerSlice.actions.setActiveRouter("garbage"));
    //   },
    // },
  ]);

  return (
    <div className="navbar">
      <div
        className="nav-logo"
        onClick={function () {
          dispatch(routerSlice.actions.setActiveRouter("homePage"));
        }}
      >
        <img src={img} />
      </div>
      <div className="nav-items">
        {navItems.map(function (item, index) {
          return (
            <NavItem item={item} key={index}>
              {(function () {
                if (item.content) {
                  return item.content();
                }
              })()}
            </NavItem>
          );
        })}
      </div>
      <div className="nav-end">
        <div className="nav-items">
          {/* coming soon with more options */}

          {secondNavItems.map(function ({ icon, onClick }, index) {
            return (
              <div className="nav-item dropdown" onClick={onClick} key={index}>
                <p>{icon}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
