import React, { useState } from "react";
import styles from '../garbage/garbage.module.css';


export default function Settings () {

    let [activeSetting,setActiveSetting] = useState({}); 
    return <div className={styles["garbage"]}>
    <div className={styles["side-bar"]}>
        <h1><i className="fas fa-cog   "></i> Settings</h1>
        <div className={styles["side-bar-items"]}>
            <div 
            className={styles["side-bar-item"]}
            >
                <span><i className="fa fa-folder" aria-hidden="true"></i> Projects</span>
            </div>
            <div className={styles["side-bar-item"]}>
                <span><i className="fab fa-flipboard"></i> Boards</span>
            </div>
            <div className={styles["side-bar-item"] }>
                <span><i className="fa fa-list" aria-hidden="true"></i> Lists</span>
            </div>
            <div className={styles["side-bar-item"]}>
                <span><i className="fa fa-folder" aria-hidden="true"></i> Cards</span>
            </div>
        </div>
    </div>
    

    <div className={styles["garbage-body"]}>
        <h1>Coming soon !</h1>
    </div>
</div>
}