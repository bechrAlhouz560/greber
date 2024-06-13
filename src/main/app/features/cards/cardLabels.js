import { createSlice } from "@reduxjs/toolkit";



export default createSlice ({
    name: "cardLabels",
    initialState:[],
    reducers: {
        addLabel : function (state,action) { 
            let label = action.payload;
            return [...state,label]
        },
        editLabel: function (state,action) { 
            let editedLabel = action.payload;
            let labels = state.filter(function (label) {
                if (label.id !== editedLabel.id)
                {
                    return label
                }
            })
            
            return [
                ...labels,editedLabel
            ]
        },
        init: function (state,action) { 
            let initState = action.payload;
            return initState;
        }
    }
})