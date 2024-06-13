import { createSlice } from "@reduxjs/toolkit";


export default createSlice ({
    name:'cardActivity',
    initialState : [],
    reducers:{
        addActivity: function (state,action) {
            let act = action.payload;
            return [...state,act]
        },
        editActivity : function (state,action) { 
            let editedAct = action.payload;
            let acts = state.filter(function (act) {
                if (act.id !== editedAct.id)
                {
                    return act
                }
            })
            
            return [
                ...acts,editedAct
            ]
        },

        delActivity : function (state,action) {
            let activity = action.payload;

            return state.filter(function (act) {
                if (activity.id !== act.id)
                {
                    return act;
                }
            })
        },
        init : function (state,action) { 
            return action.payload;
        }
    }
})