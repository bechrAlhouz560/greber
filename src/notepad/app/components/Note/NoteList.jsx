import styles from './note.module.css';
import NoteCard from './NoteCard.jsx';
import { FiPlus } from "react-icons/fi";
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { db } from '../../../renderer';
import { useSelector } from 'react-redux';
import noteSlice from '../../features/noteSlice';

export function genID (length = 10) {
    
    let num = Math.floor(Math.random()*10**(length))
    return num;
}

export function addNote (title = "Note Title") {

    const note = {
        id : genID(),
        title,
        created_at : new Date(),
        bg : "#e7e7e7",

    }
    return new Promise(function (resolve,reject) {
       
        db.insert(note, function (err,doc) {

            if (err)
            {

                
                reject(err);
            }
            else
            {
                resolve(doc);
            }

            
        })

    })
}

export function removeNote (id) {

    return new Promise (function (resolve,reject) {
        
        db.remove({id}, {multi: false} , function (err, n) {

            
            if (!err)
            {
                resolve(id)
            }
            else
            {
                reject(err);
            }
        })
    })
}

export function editNote (note) {
    return new Promise(function (resolve,reject) {
        db.update({id: note.id}, note, {multi : false, upsert : true} , function (err) {
            if (err)
            {
                reject(err)
            }
            else
            {
                resolve(note)
            }
        })
    })
}
export function AddNote ({notesLength}) {

    const dipatch = useDispatch();
    return <div className="add-note" onClick={
        async function () {

            const note = await addNote(`Note ${notesLength + 1}`);
            dipatch(noteSlice.actions.addNote(note));

           

        }
    }>
            <FiPlus />
    </div>
}
export default function NoteList () {
    const notes = useSelector ((state)=> state.notes);
    return <div className={styles["note-list"]}>
        {
            notes.map((note , index) => <NoteCard note={note} key={index}/>)
        }
        <AddNote notesLength = {notes.length}/>

    </div>
}