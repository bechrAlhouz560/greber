import noteSlice from "./features/noteSlice"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
// Root Reducer
const rootReducer = combineReducers({
    notes : noteSlice.reducer
})



const store = configureStore({
    
    reducer: rootReducer,
    middleware: []
})

export default store