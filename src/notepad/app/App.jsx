import store from "./store";
import React, { useState } from "react";
import {Provider} from 'react-redux'
import font from '../../assets/fonts/font.ttf'
import TopBar from "./components/topbar/TopBar.jsx";
import NoteList from "./components/Note/NoteList.jsx";
import { createContext } from "react";
import Note from "./components/Note/Note.jsx";



// Contexts

export const ActiveNoteContext = createContext({
    activeNote : null,
    setActiveNote : ()=> {}
})
export default function App () {

     const [activeNote, setActiveNote] = useState(null)
     return <ActiveNoteContext.Provider value={{activeNote, setActiveNote}}>
            <Provider store={store}>
                <style>
                    {/* adding the font family globally to the app */}
                    {
                        `
                        @font-face {
                            font-family: 'greber-font';
                            src: url(${font});
                         }
                            * {
                                font-family: 'greber-font' , 'Cairo'
                            }
                        `
                    }
                </style>
                
                <TopBar />
                
                <div className="body">
                    {
                        activeNote ? <Note /> : <NoteList />
                    }
                

                </div>
            </Provider>
     </ActiveNoteContext.Provider>
}