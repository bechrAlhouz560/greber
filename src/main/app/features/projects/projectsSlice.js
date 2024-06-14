import { createSlice } from "@reduxjs/toolkit";

export const recentProjectsSlice = createSlice({
  name: "recentProjects",
  initialState: [],
  reducers: {
    addRecentProject: function (state, action) {
      let infos = action.payload;
      let exists = false;
      for (let project of state) {
        if (project.id === infos) {
          exists = true;
          break;
        }
      }

      if (!exists) {
        return [infos, ...state];
      }
      return state;
    },
    removeRecentProject: function (state, action) {
      return state.filter(function (project) {
        if (project.name !== action.payload) {
          return action.payload;
        }
      });
    },
    init: function (state, action) {
      return action.payload.map((project) => project.project_id);
    },
  },
});
const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    activeProject: {},
  },
  reducers: {
    addProject: function (state, action) {
      let infos = action.payload;
      return {
        ...state,
        projects: [...state.projects, infos],
      };
    },
    removeProject: function (state, action) {
      return {
        ...state,
        projects: state.projects.filter(function (project) {
          if (project.id !== action.payload.id) {
            return action.payload;
          }
        }),
      };
    },
    setActiveProject: function (state, action) {
      let activeProject = action.payload;
      return {
        ...state,
        activeProject,
      };
    },
    addProjectBoard: function (state, action) {
      let board = action.payload;

      return {
        ...state,
        activeProject: {
          ...state.activeProject,
          boards: [...state.activeProject.boards, board],
        },
      };
    },
    editProject: function (state, action) {
      let _project = action.payload;
      let oldProjects = state.projects.filter(function (project) {
        if (_project.id !== project.id) {
          return project;
        }
      });
      return {
        projects: [_project, ...oldProjects],
        activeProject: state.activeProject,
      };
    },
    init: function (state, action) {
      return action.payload.projects
        ? action.payload
        : {
            projects: action.payload,
            activeProject: {},
          };
    },
  },
});
export default projectsSlice;
