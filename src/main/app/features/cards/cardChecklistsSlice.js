import { createSlice } from "@reduxjs/toolkit";


export default createSlice ({
    name:"cardChecklists",
    initialState: [],
    reducers : {
        addChecklist: function (state,action) { 
            let checklist = action.payload;
            return [...state,checklist];
               
        },
        editChecklist: function (state,action) { 
            let editedChecklist = action.payload;
            let checklists = state.filter(function (checklist) {
                if (checklist.id !== editedChecklist.id)
                {
                    return checklist
                }
            })
            
            return [
                ...checklists,editedChecklist
            ]
        },

        delChecklist : function (state,action) {
            let deletedChecklist = action.payload;
            return state.filter (function (checklist) {
                if (checklist.id !== deletedChecklist.id)
                {
                    return checklist;
                }
            })
        },
        init : function (state,action) { 
            return action.payload;
        }
    }
})