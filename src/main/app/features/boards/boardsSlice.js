import { createSlice } from "@reduxjs/toolkit";

const boardsSlice = createSlice ({
    name:"boards",
    initialState:[],
    reducers : {
        addBoard: function (state,action) { 
            return [...state,action.payload]
        },
        editBoard: function (state,action) {
            let _board = action.payload;
            let oldBoards = state.filter(function (board) {
                if (_board.id !== board.id)
                {
                    return board
                }
            });
            return [_board,...oldBoards]; 
        },
        removeBoard: function (state,action) {
            return state.filter(function (board) { 
                 if (board.id !== action.payload.id)
                 {
                     return board
                 }
             })
        },
        init : function (state,action) { 
            return action.payload;
        }
    }
    
});

export default boardsSlice;