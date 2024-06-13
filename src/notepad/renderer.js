import render from "./index.jsx";
import Nedb from "nedb";
import getAppData from "../main/utils/getAppData.js";
import path from "path";
import store from "./app/store.js";
import noteSlice from "./app/features/noteSlice.js";

const db_path = getAppData() + '/databases';



export const db = new Nedb({
    autoload: true,
    filename: path.resolve(db_path, 'notes.db')
});




db.find({}, function (err, doc) {
    if (!err) {
        const action = noteSlice.actions.init(doc.map((val) => {
            delete val._id;
            return val
        }));
        store.dispatch(action)
        render()
    }
})