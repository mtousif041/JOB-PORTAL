import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const applicationSlice = createSlice({
    /////creating slice
    name: "applications",
    initialState:{
        applications: [],
        loading: false,
        error: null,
        message: null,
    },


    // ab bnaynge reducers
    reducers: {
        ///////////ye get applications ke liye kaam kregi // yaani ye uske liye kamm krega ki agr employer dhekna chaye ki muje kis kis ne applications bheji hai 
        requestForAllApplications(state, action){
            state.loading = true;
            state.error = null;
        },
        successForAllApplications(state, action){
            state.loading = false;
            state.error = null;
            state.applications = action.payload;
        },
        failureForAllApplications(state, action){
            state.loading = false;
            state.error = action.payload;
        },


        ////////////////////////ab jo job-seeker hua vo dhekega ki mene kha kha pe application bheji hai , yaani vo sirf apni application dhekega 
        requestForMyApplications(state, action){
            state.loading = true;
            state.error = null;
        },
        successForMyApplications(state, action){
            state.loading = false;
            state.error = null;
            state.applications = action.payload;
        },
        failureForMyApplications(state, action){
            state.loading = false;
            state.error = action.payload;
        },


        //////////////////////////ab post a application ke liye bnayenge 
        requestForPostApplication(state, action){
            state.loading = true;
            state.error = null;
            state.message = null
        },
        successForPostApplication(state, action){
            state.loading = false;
            state.error = null;
            state.message = action.payload; // message aayega like application posted 
        
        },
        failureForPostApplication(state, action){
            state.loading = false;
            state.error = action.payload;
            state.message = null;

        },
        //////////////////////////ab delete a application ke liye bnayenge 
        requestForDeleteApplication(state, action){
            state.loading = true;
            state.error = null;
            state.message = null
        },
        successForDeleteApplication(state, action){
            state.loading = false;
            state.error = null;
            state.message = action.payload;
        
        },
        failureForDeleteApplication(state, action){
            state.loading = false;
            state.error = action.payload;
            state.message = null;

        },

/////////////////////////////////////////////////////////////////////////
        clearAllErrors(state, action){
           state.error = null;
           state.applications = state.applications;
        },


        resetApplicationSlice(state, action){
            state.error = null;
            state.applications = state.applications;
            state.message = null;
            state.loading = false;
        },

    }
});



////////////////////////////
export const fetchEmployerApplication = ()=>async (dispatch)=>{
    dispatch(applicationSlice.actions.requestForAllApplications());
    try {
    //    const response = await axios.get(`http://localhost:5000/api/v1/application/employer/getall`, {
       const response = await axios.get(`http://192.168.43.226:5000/api/v1/application/employer/getall`, {
           withCredentials: true,
       });
       dispatch(applicationSlice.actions.successForAllApplications(response.data.applications));
       dispatch(applicationSlice.actions.clearAllErrors());
    } catch (error) {
       dispatch(applicationSlice.actions.failureForAllApplications(error.response.data.message));
    }
}




////////////////////////////
export const fetchJobSeekerApplication = () => async (dispatch)=>{
    dispatch(applicationSlice.actions.requestForMyApplications());
    try {
    //    const response = await axios.get(`http://localhost:5000/api/v1/application/jobseeker/getall`, {
       const response = await axios.get(`http://192.168.43.226:5000/api/v1/application/jobseeker/getall`, {
           withCredentials: true,
       });
       dispatch(applicationSlice.actions.successForMyApplications(response.data.applications));
       dispatch(applicationSlice.actions.clearAllErrors());
    } catch (error) {
       dispatch(applicationSlice.actions.failureForMyApplications(error.response.data.message));
    }
}





///////////////function for  post a application

//ye data frontend se aarha hai fir link se hota hua backend me chala jayega
export const postApplication = (data, jobId)=>async (dispatch)=>{ // ye do cheje lega ek data dusra job ki id 
         dispatch(applicationSlice.actions.requestForPostApplication());
         try {
            // const response = await axios.post(`http://localhost:5000/api/v1/application/post/${jobId}`, data, {
            const response = await axios.post(`http://192.168.43.226:5000/api/v1/application/post/${jobId}`, data, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                },
            });
            dispatch(applicationSlice.actions.successForPostApplication(response.data.message));
            dispatch(applicationSlice.actions.clearAllErrors());
         } catch (error) {
            dispatch(applicationSlice.actions.failureForPostApplication(error.response.data.message));
         }
};


/////////////////function for delete application
export const deleteApplication = (id)=>async(dispatch)=>{
         dispatch(applicationSlice.actions.requestForDeleteApplication());
         try {
            // const response = await axios.delete(`http://localhost:5000/api/v1/application/delete/${id}`,{withCredentials:true});
            const response = await axios.delete(`http://192.168.43.226:5000/api/v1/application/delete/${id}`,{withCredentials:true});
            dispatch(applicationSlice.actions.successForDeleteApplication(response.data.message));
            dispatch(clearAllApplicationErrors());
         } catch (error) {
            dispatch(applicationSlice.actions.failureForDeleteApplication(error.response.data.message));
         }
}


export const clearAllApplicationErrors = ()=>(dispatch)=>{//phela parenthesis me agr apko frontend mese koi value bhjni hai to vo aayega , aur dusre me hum dispatch kr lenge ya khuch aur kr leneg 
    dispatch(applicationSlice.actions.clearAllErrors())
}


/////function for reseting job slice
export const resetApplicationSlice = ()=>(dispatch)=>{
 dispatch(applicationSlice.actions.resetApplicationSlice());
};




export default applicationSlice.reducer;

////ab ise use krne ke lie store.js me jao