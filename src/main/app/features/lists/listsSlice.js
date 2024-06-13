import { createSlice } from "@reduxjs/toolkit";

const listsSlice = createSlice({
  name: "lists",
  initialState: [],
  reducers: {
    addList: function (state, action) {
      let list = action.payload;
      return [...state, list];
    },
    editList: function (state, action) {
      let _list = action.payload;
      let oldLists = state.filter(function (list) {
        if (_list.id !== list.id) {
          return list;
        }
      });
      return [_list, ...oldLists];
    },
    removeList: function (state, action) {
      let list = action.payload;
      return state.filter(function (_list) {
        if (list.id !== _list.id) {
          return _list;
        }
      });
    },
    init: function (state, action) {
      return action.payload;
    },
  },
});
export default listsSlice;
