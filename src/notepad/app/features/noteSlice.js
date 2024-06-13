import { createSlice } from "@reduxjs/toolkit";



const noteSlice = createSlice({
    name:"notes",
    initialState:[],
    reducers: {
        init : function (state,action) { 
            return action.payload;
        },

        addNote : function (state, action) {
            return [...state, action.payload];
        },

        removeNote : function (state , action) {
            const new_notes = []
            for (const note of state) {
                if (note.id !== action.payload)
                {
                    new_notes.push(note)
                }
            }
            return new_notes;
        },
        editNote : function (state,action) {
            const newNote = action.payload;

            return state.map(function (note) {

                return note.id === newNote.id ? newNote : note 
            })  
        }
    }
    
})
export default noteSlice;