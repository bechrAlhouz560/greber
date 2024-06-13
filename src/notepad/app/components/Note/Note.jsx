import React , { useContext, useRef, useState } from 'react';
import { useEffect } from 'react';
import { FiArrowLeft, FiBold, FiCheck, FiImage, FiItalic, FiLink, FiList } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { globalColors } from '../../../../main/utils/globals.js';
import { ActiveNoteContext } from '../../App.jsx';
import noteSlice from '../../features/noteSlice.js';
import styles from './note.module.css'
import { editNote } from './NoteList.jsx';
import {BiHeading} from 'react-icons/bi';
import {MdFormatColorText} from 'react-icons/md'
import {AiOutlineOrderedList, AiOutlineUnorderedList} from 'react-icons/ai';
import {VscTextSize} from 'react-icons/vsc';

import { shell ,  } from 'electron';



export function NoteOptions ({content,setDesc}) {

    // soon to delete the document.exeCommand functionnality and replace it with document.getSelection
    function ranges() {
        const s = window.getSelection();
        return Array.from({
          length: s.rangeCount
        }).map((u, i) => s.getRangeAt(i));
    }

    
    /**  surround the current selected text with an element */    
    function surroundSelected (elName) {
        

        var selection, range, node, el;
        
            selection = window.getSelection();
            range     = selection.getRangeAt(0);
            node      = selection.focusNode;
        
            if (range.collapsed) {

              range = document.createRange();
              range.selectNodeContents(node);
              selection.removeAllRanges();
              selection.addRange(range);
            }
        
            el = document.createElement(elName);
            range = selection.getRangeAt(0);
            range.surroundContents(el);
            selection.removeAllRanges();

            return el;

            
    }

    
    return <div className={styles["note-edits"]}>

        <div className={styles["edit"]} onClick={() => {document.execCommand('formatBlock', false,'<h1>')}}>
            <span><BiHeading /></span>
        </div>
        <div className={styles["edit"]} onClick={() => document.execCommand('bold')}>
            <span><FiBold /></span>
        </div>
        <div className={styles["edit"]} onClick={() => document.execCommand('italic')}>
            <span><FiItalic /></span>
        </div>
        <div className={styles["edit"]} onClick={() => document.execCommand('formatBlock', false,'<del>')}>
            <span><del>de</del></span>
        </div>
        <div className={styles["edit"]} onClick={() => document.execCommand('underline')}>
            <span><MdFormatColorText /></span>
        </div>
        <div className={styles["edit"]} onClick={() => document.execCommand('insertOrderedList')}>
            <span><AiOutlineOrderedList /></span>
        </div>
        <div className={styles["edit"]} onClick={() => document.execCommand('insertUnOrderedList')}>
            <span><AiOutlineUnorderedList /></span>
        </div>
        <div className={styles["edit"]} onClick={() => document.execCommand('fontSize',false,"3")}>
            <span><VscTextSize /></span>
        </div>
        <div className={styles["edit"]} onClick={function () {
            const range = ranges()[0];

            const reg = /http(s)?:\/\//
            
            let link = range.endContainer.textContent;
            
            if (!reg.test(link))
            {  
                link = "http://"+link;
            }
            if (!range.collapsed)
            {

                document.execCommand('createLink',false,link);
                range.endContainer.firstChild.addEventListener('click',function () {
                     shell.openExternal(link);
                }) 
               
            }

            
        
        }}>
            <span><FiLink /></span>
        </div>
        {/* <div className={styles["edit"]} onClick={() => {
            const el = surroundSelected('img')

            el.src = "https://images.unsplash.com/photo-1667153538223-19ab7dab4640?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=300&q=60"
        }}>
            <span><FiImage /></span>
        </div> */}
        
        
        

        
    </div>
}
export default function Note () {

    const {activeNote, setActiveNote} = useContext(ActiveNoteContext);

    
    const note = useSelector((state) => {
        for (const _note of state.notes)
        {
            if (_note.id === activeNote.id)
            {
                return _note;
            }
        }
    });

    const [activeBg,setActiveBg] = useState(note.bg);
    const [desc,setDesc] = useState(note.desc);
    const dispatch = useDispatch();
    const content = useRef();
    

    function onChange () {
        editNote({
            ...note,
            desc 
        }).then(function () {
            const action = noteSlice.actions.editNote({...note,desc});
            dispatch(action);
        });
    }
    useEffect(onChange, [desc]);

    useEffect(function () {
        document.execCommand('defaultParagraphSeparator', false, 'p');

        if (content.current)
        {
            content.current.innerHTML = desc || '';
            
            // checking for all the links



            for (const child of content.current.getElementsByTagName('a')) {
                const reg = /http(s)?:\/\//

                
                let link = child.textContent;
                
                if (!reg.test(link))
                {  
                    link = "http://"+link;
                }
                child.addEventListener('click',function () {
                    shell.openExternal(link);
                })


            }
        }
    }, [content.current])

    
    return <div className="note" style={{background : activeBg === "#e7e7e7" ? undefined : activeBg}}>
        <NoteOptions content={content.current} setDesc={setDesc}/>
        <div ref={content} spellCheck={false} 
        onPaste={

            // disabling html pasting
            function (e) {
                e.preventDefault()
                var text = e.clipboardData.getData('text/plain')
                document.execCommand('insertText', false, text);
            }
        }
        contentEditable={true} data-placeholder="Enter Text..."  onInput={
            function (e) {

                setDesc(e.currentTarget.innerHTML);
            }
        } className={styles['textarea']} >
            
        </div>
        <div className={styles['addons']}>
            <div className="back-btn" onClick={() => setActiveNote(null)}>

                <span><FiArrowLeft /></span>
            </div>

            <div className="bg-list-abs">
                <div className="bg-list">
            {
                globalColors.map(function (bg,index) {
                    return <div className="bg" key={index} style={
                        {
                         
                            background: bg
                        }
                    } onClick={
                        function () {
                            editNote({
                                ...note,
                                bg 
                            }).then(function () {
                                const action = noteSlice.actions.editNote({...note,bg});
                                dispatch(action);
                                setActiveBg(bg)
                            });
                        }
                    }>
                        {
                                    (function () {
                                        if (activeBg === bg)
                                        {
                                            return <div><FiCheck /></div>
                                        }
                                    })()
                                }
                    </div>
                })
            }
                </div>
            </div>
        </div>
    </div>
}