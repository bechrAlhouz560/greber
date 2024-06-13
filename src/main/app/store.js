/**
 * Redux Store
 */

// modules
import {
  configureStore,
  combineReducers,
  createReducer,
  applyMiddleware,
} from "@reduxjs/toolkit";

// importing redux slices
import boardsSlice from "./features/boards/boardsSlice";
import listsSlice from "./features/lists/listsSlice";
import projectsSlice, {
  recentProjectsSlice,
} from "./features/projects/projectsSlice";
import savedProjectsSlice from "./features/projects/savedProjectsSlice";
import routerSlice from "./features/router/routerSlice";
import cardsSlice from "./features/cards/cardsSlice";
import cardActivityslice from "./features/cards/cardActivityslice";
import cardChecklistsSlice from "./features/cards/cardChecklistsSlice";
import checklistItemsSlice from "./features/cards/checklistItemsSlice";
import cardLabels from "./features/cards/cardLabels";
import eventSlice from "./features/event/eventSlice";
import middlewares from "./features/middlewares";

// Root Reducer
const rootReducer = combineReducers({
  projects: projectsSlice.reducer,
  boards: boardsSlice.reducer,
  recentProjects: recentProjectsSlice.reducer,
  savedProjects: savedProjectsSlice.reducer,
  router: routerSlice.reducer,
  lists: listsSlice.reducer,
  cards: cardsSlice.reducer,
  cardEditor: createReducer({}, function (builder) {
    builder
      .addCase("cardEditor/setActive", function (_, action) {
        let card = action.payload;
        return card;
      })
      .addCase("cardEditor/setInActive", function (_, action) {
        return {};
      });
  }),
  cardActivity: cardActivityslice.reducer,
  cardChecklists: cardChecklistsSlice.reducer,
  checklistItems: checklistItemsSlice.reducer,
  cardLabels: cardLabels.reducer,
  events: eventSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: middlewares,
});

export default store;
