import { createSlice } from "@reduxjs/toolkit";



const eventSlice = createSlice({
    name:"events",
    initialState:[],
    reducers: {
        addEvent: function (state,action) {
            let event = action.payload;
            return [...state,event];
        },
        editEvent : function (state,action) {
            let _event = action.payload;
            let oldEvent = state.filter(function (list) {
                if (_list.id !== list.id)
                {
                    return list
                }
            });
            return [_event,...oldEvent]; 
        },
        removeEvent : function (state,action) { 
            let event = action.payload;
            return state.filter(function (_event) { 
                if (event.id !== _event.id)
                {
                    return _event
                }
            })
            
        },
        init : function (state,action) { 
            return action.payload;
        }
    }
    
})
export default eventSlice;