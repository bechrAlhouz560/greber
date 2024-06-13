import React from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { FiEdit, FiTrash, FiX } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { ActiveNoteContext } from '../../App.jsx';
import noteSlice from '../../features/noteSlice';
import styles from './note.module.css';
import { removeNote , editNote } from './NoteList.jsx';


function getBrightness (c)
{
    var c = c.substring(1);      // strip #
    var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue

    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    return luma;
}
export default function NoteCard ({note}) {

    const dispatch = useDispatch();

    const [editing,setEditing] = useState(false);
    const {setActiveNote} = useContext(ActiveNoteContext)
    return <div className={styles["note-card"]} style={{background : note.bg}}>
        {
            editing ? <input type="text" 
            placeholder='Note Title...' 
            className={styles["editing"]} 
            style={{color : note.bg !== "#e7e7e7" ? "white" : null}}
            onKeyDown = {
                async function ({key, currentTarget}) {
                    if (key === "Enter")
                    {
                        const n = await editNote({
                            ...note,
                            title : currentTarget.value
                        });

                        const action = noteSlice.actions.editNote(n);
                        dispatch(action);

                        setEditing(false);
                    }
                }
            }
            /> :
            <div className={styles['note-title']} onClick={()=> setActiveNote(note)}>    
                <span style={{color : note.bg !== "#e7e7e7" ? "white" : null}}>{note.title}</span>
        </div>
        }

        <div className={styles["note-options"]}>
            <div className={styles["note-option"]} onClick={() => setEditing(!editing)}>
                {editing ? <FiX style={{color : note.bg !== "#e7e7e7" ? "white" : null}}/> : <FiEdit 
                style={{color : note.bg !== "#e7e7e7" ? "white" : null}}/>}
            </div>
            <div className={styles["note-option"]} onClick={async function () {
                const id = await removeNote(note.id);
                dispatch(noteSlice.actions.removeNote(id));
                
                
            }}><FiTrash style={{color : note.bg !== "#e7e7e7" ? "white" : null}}/></div>
        </div>
    </div>
}
