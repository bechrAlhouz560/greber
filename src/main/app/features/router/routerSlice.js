import { createSlice } from "@reduxjs/toolkit";



const routerSlice = createSlice ({
    name:'router',
    initialState:{
        activeRouter: 'homePage',
        routerHistory: []
    },
    reducers:{
        setActiveRouter: function (state,action) { 
            let activeRouter = action.payload;
            return {
                ...state,activeRouter
            };
        },
        addRouteHistory : function (state,action) {
            let route = action.payload;
            return {
                ...state, routerHistory : [...state.routerHistory,route]
            }
        }
    }

})

export default routerSlice;