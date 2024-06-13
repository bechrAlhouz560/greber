import styles from './topbar.module.css';
import React  , { useContext } from 'react';
import { FiMinus, FiX } from 'react-icons/fi';
import { ActiveNoteContext } from '../../App.jsx';
import { ipcRenderer } from 'electron';
export default function () {

    const {activeNote} = useContext(ActiveNoteContext);
    return <div className={styles["top-bar"]}>
        <div className={styles["body"]}>
            <span className={styles['title']}>NotePad {activeNote?.title ? '- ' + activeNote.title : '' }</span>
        </div>
        <div className={styles["window-btns"]}>
            <div className={styles["win-btn"]} onClick={()=> ipcRenderer.send('hide-window')}>
                <span><FiMinus /></span>
            </div>
            <div className={styles["win-btn"] + " " + styles['danger']} onClick={()=> ipcRenderer.send('close-window')}>
                <span><FiX /></span>
            </div>
        </div>
    </div>
}