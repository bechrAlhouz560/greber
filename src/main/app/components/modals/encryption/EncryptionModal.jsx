import React from "react";
import { ModalContainer } from "../CreateProjectModal.jsx";
import styles from './encryption-modal.module.css';
import { importData, exportData } from "../../../db/data";
import { useState } from "react";
import { dialog } from "@electron/remote";
import path from "path";
import greberDB from "../../../db/main.js";
import store from "../../../store.js";


export function DataSaver () {


    const [password,setPassword] = useState('');

    const [loading,setLoading] = useState(false);



    async function saveData () {
        let dir = await dialog.showOpenDialog({
            message: "Choose a folder to save your data",
            properties: ['openDirectory' , 'createDirectory'],
           

        });

        let dirPath = dir.filePaths[0];
        await exportData(path.resolve(dirPath, 'greber-data.json') , password);
    
    }
    return <div className={styles["half"]}>
    <input type="password" className="g-input " 
    placeholder="Password"
    onChange={({currentTarget : {value}} ) => setPassword(value)}
    value={password}
    
    />
    <br />
    <br />
    <span style={{opacity : .5 , fontSize : "smaller"}}>
        * you should save your password somewhere save
        to use it later
    </span>
    <br />
    <br />
    <button className="g-btn g-btn-rounded"
    onClick={function () {
        setLoading(true);

        saveData().then(function () {
            setLoading(false);
        })
    } }
    disabled = {!password || loading}
    >{loading ? "Saving..." : "Save Data"  }</button>
</div>
}

export function DataImporter () {

    const [password,setPassword] = useState('');
    const [filePath,setFilePath] = useState('');
    const [loading,setLoading] = useState(false);

    async function getData () {
      
        let data = await importData(filePath , password);

        try {

            console.log("parsing...")
            let jsonData = JSON.parse(data.toString());
            console.log('restoring...')
            await greberDB.restore(jsonData)
            
        } catch (error) {
            console.log(error)
        }
    }
    return <div className={styles["half"]}>

    <input type="file" onInput={(data) => setFilePath(data.currentTarget?.files[0]?.path)} 
    
    />
    <br />
    <br />
    <input type="password" className="g-input " placeholder="Password"
    onChange={({currentTarget : {value}} ) => setPassword(value)}
    value={password}
    />
    <br />
    <br />
    <button className="g-btn g-btn-rounded g-btn-danger" 
    disabled = {!filePath || !password || loading}
    onClick={function () {
        setLoading(true);
        getData().then(function () {
            setLoading(false);
        })
    }}>{loading ? "importing...": "Import Data"}</button>
</div>
}

export default function ({setModalActive}) {


    return <ModalContainer setModalActive={setModalActive}>
        <div className={styles["encryption-modal"]}>
            <div className={styles["header"]}>
                <h1><i class="fa fa-database" aria-hidden="true"></i> Data Import & Save</h1>
                <p style={{opacity : .5,paddingTop: 10}}>import your old greber data or save them with your own password</p>
            </div>
            
            <div className={styles["body"]}>
                <DataImporter />
                <DataSaver />
            </div>
            
        </div>
    </ModalContainer>
}