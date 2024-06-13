import { createSlice } from "@reduxjs/toolkit";




const savedProjectsSlice = createSlice ({
    name:"savedProjects",
    initialState:[],
    reducers:{
        addSavedProject: function (state,action) {
            const project = action.payload;
            return [...state,project];
        },
        editProject : function (state,action) { 
            let _project = action.payload;
            let oldProjects = state.filter(function (project) {
                if (_project.id !== project.id)
                {
                    return project
                }
            });
            return  [_project,...oldProjects];
        },
        removeSavedProject: function (state,action) {
            const project = action.payload;
            console.log(project)
            let new_list = state.filter(function (_project) {
                if (_project !== project)
                {
                    return _project
                }
            })


            return new_list
        },
        init : function (state,action) { 
            return action.payload.map((project)=> project.project_id);
        }
    }

})

export default savedProjectsSlice