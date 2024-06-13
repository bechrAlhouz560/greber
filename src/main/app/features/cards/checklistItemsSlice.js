import { createSlice } from "@reduxjs/toolkit";

export default createSlice({
    name:'checklistItems',
    initialState: [],
    reducers: {
        addItem: function (state,action) { 
            return [...state,action.payload];
        },
        editItem: function (state,action) { 
            let editedItem = action.payload;
            let items = state.filter(function (item) {
                if (item.id !== editedItem.id)
                {
                    return item
                }
            })
            
            return [
                ...items,editedItem
            ]
        },
        delItem: function (state,action) { 
            let item = action.payload;
            return state.filter(function (_item) { 
                if (item.id !== _item.id)
                {
                    return _item
                }
            })
        },
        init : function (state,action) { 
            return action.payload;
        } 
    }
})