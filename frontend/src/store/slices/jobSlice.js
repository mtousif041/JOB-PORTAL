import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const jobSlice = createSlice({
    name: "jobs", // ap isi naam ke jriye ise access kr shakte ho 
    initialState: {
        jobs: [], // yaani jobs naam ka ek aaray jiski initial value empty hogi 
        loading: false,
        error: null,
        message: null,
        singleJob: {}, // initially empty object
        myJobs: [],
    },

    reducers: { // ab in reducers ki madad se hum uper valo ki initial values ko change kr shakte hai 
        requestForAllJobs(state, action){ // action kiya hota hai ki un values ko accept krta hai jin values ko hum apne function me se yha bhej shakte hai, aur state ke jriye me uper vale variables ko access kr shakta hu 
            state.loading = true;
            state.error = null; // yaani requestForAllJobs jab exicute hoga to aapko loading true aur error ko null kr dena hai 
        },

        successForAllJobs(state, action){
            state.loading = false;
            state.jobs = action.payload;// yaani successForAllJobs jab exicute ho gya  to aapko loading false krdo  aur error ko null kr dena hai aur jobs ke ander saari jobs ko bhejdo  
            state.error = null;
        },

        failureForAllJobs(state, action){
            state.loading = false;
            state.error = action.payload; // agr failure hua to error me vo error  bhejna hai jo hmare backend se aayega 
        },


        //////////////////////////////////////ye thino reducers ek single job ko fetch krvaane ke liye hai 
        requestForSingleJob(state, action){
            state.message=null;
            state.error=null;
            state.loading=true;
        },

        successForSingleJob(state, action){
            state.loading=false;
            state.error=null;
            state.singleJob=action.payload;
        },


        failureForSingleJob(state, action){
            state.singleJob=state.singleJob;
            state.error=action.payload;
            state.loading=false;
        },
        //////////////////////////////////////reducers for post a job
        requestForPostJob(state, action){
            state.message=null;
            state.error=null;
            state.loading=true;
        },

        successForPostJob(state, action){
            state.message=action.payload;
            state.loading=false;
            state.error=null;
        },


        failureForPostJob(state, action){
            state.message=null;
            state.error=action.payload;
            state.loading=false;
        },
        //////////////////////////////////////reducers for post a job
        requestForMyJobs(state, action){
            state.loading=true;
            state.myJobs=[];
            state.error=null;
        },

        successForMyJobs(state, action){
            state.loading=false;
            state.myJobs=action.payload;
            state.error=null;
        },


        failureForMyJobs(state, action){
            state.loading=false;
            state.myJobs=state.myJobs; /// yaani iski jo initial value thi vo hi rhaegi
            state.error=action.payload;
        },



    /////////////////////////////////////reducers delete a job ke liye bnayenge 
           requestForDeleteJob(state, action){
            state.loading = true;
            state.error = null;
            state.message = null
        },
        successForDeleteJob(state, action){
            state.loading = false;
            state.error = null;
            state.message = action.payload;
        
        },
        failureForDeleteJob(state, action){
            state.loading = false;
            state.error = action.payload;
            state.message = null;

        },





////////////////////////////////////////////////////////////
        clearAllErrors(state, action){
            state.error = null;
            state.jobs = state.jobs;
        },


        resetJobSlice(state, action){ // yaani ye reducer pure slice ko reset krvane ke liye hai 
            state.error = null;
            state.jobs = state.jobs;
            state.loading = false;
            state.message = null;
            state.myJobs = state.myJobs;
            state.singleJob = {};
        },



    },
});



/////////////////////function for fetching all jobs
export const fetchJobs = (city, niche, searchKeyword = "")=>async(dispatch)=>{ // asyns isliye agr vha pe function async hua to 
     try {
        dispatch(jobSlice.actions.requestForAllJobs());
        // let link  = "http://localhost:5000/api/v1/job/getall?" // to jitni bhi jobs hai un sabko get krne ke liye ye hmara link hai
        let link  = "http://192.168.43.226:5000/api/v1/job/getall?" // to jitni bhi jobs hai un sabko get krne ke liye ye hmara link hai
        let queryParams = []; 
        if(searchKeyword){
            queryParams.push(`searchKeyword=${searchKeyword}`); // yaani queryParams ke ander aap push krdo  searchKeyword
        }


        if(city){
            queryParams.push(`city=${city}`); 
        }  


        if(niche){
            queryParams.push(`niche=${niche}`); 
        }

        link+= queryParams.join("&"); // yaani queryParams me jitni quries un sab  ko add ya join krlo & ke jariye // like city=india&niche=software

        const response = await axios.get(link, {withCredentials: true});
        // alert(queryParams.join("&"))
        

        dispatch(jobSlice.actions.successForAllJobs(response.data.jobs)); // ye wala jobs haina jobController me se hi aarha hai res.status.json me se 
        // alert(response.data.jobs)

        //ab agr koi chota mota error ho to use bhi aap clear krva lo
        dispatch(jobSlice.actions.clearAllErrors()); //jitne bhi errors hai saare ke saare errors ko khatam krdo 

     } catch (error) {
        dispatch(jobSlice.actions.failureForAllJobs(error.response.data.message));
     }
};


///////////////////////////////////////////////////////////////////////

export const fetchSingleJob = (jobId)=>async(dispatch)=>{
    dispatch(jobSlice.actions.requestForSingleJob());// ise app try box me bhi rhak shakte ho 
      try {
        // const response = await axios.get(`http://localhost:5000/api/v1/job/get/${jobId}`,{withCredentials:true});
        const response = await axios.get(`http://192.168.43.226:5000/api/v1/job/get/${jobId}`,{withCredentials:true});
        dispatch(jobSlice.actions.successForSingleJob(response.data.job));
        dispatch(jobSlice.actions.clearAllErrors());
      } catch (error) {
        dispatch(jobSlice.actions.failureForSingleJob(error.response.data.message));
      }
};


export const postJob = (data)=>async(dispatch)=>{
    dispatch(jobSlice.actions.requestForPostJob());
    try {
    //   const response = await axios.post(`http://localhost:5000/api/v1/job/post`, data, {withCredentials:true,
      const response = await axios.post(`http://192.168.43.226:5000/api/v1/job/post`, data, {withCredentials:true,
        headers:{
            "Content-Type":"application/json"
        }
       });
      dispatch(jobSlice.actions.successForPostJob(response.data.message));
      dispatch(jobSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(jobSlice.actions.failureForPostJob(error.response.data.message));
    }
}

/////////////////////////////////////////////////////fetching my all jobs
export const getMyJobs = ()=>async(dispatch)=>{
    dispatch(jobSlice.actions.requestForMyJobs());
    try {
    //   const response = await axios.get(`http://localhost:5000/api/v1/job/getmyjobs`,{withCredentials:true});
      const response = await axios.get(`http://192.168.43.226:5000/api/v1/job/getmyjobs`,{withCredentials:true});
      dispatch(jobSlice.actions.successForMyJobs(response.data.myJobs));
      dispatch(jobSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(jobSlice.actions.failureForMyJobs(error.response.data.message));
    }
}


///////////////////////////////////dfunction for delete jobs
export const deleteJob = (id)=> async(dispatch)=>{
    dispatch(jobSlice.actions.requestForDeleteJob());
    try {
    //    const response = await axios.delete(`http://localhost:5000/api/v1/job/delete/${id}`,{withCredentials:true});
       const response = await axios.delete(`http://192.168.43.226:5000/api/v1/job/delete/${id}`,{withCredentials:true});
       dispatch(jobSlice.actions.successForDeleteJob(response.data.message));
       dispatch(clearAllJobErrors());
    } catch (error) {
       dispatch(jobSlice.actions.failureForDeleteJob(error.response.data.message));
    }
}


////////////////function for clear all job error 
export const clearAllJobErrors = ()=>(dispatch)=>{//phela parenthesis me agr apko frontend mese koi value bhjni hai to vo aayega , aur dusre me hum dispatch kr lenge 
    dispatch(jobSlice.actions.clearAllErrors())
}


/////function for reseting job slice
export const resetJobSlice = ()=>(dispatch)=>{
 dispatch(jobSlice.actions.resetJobSlice());
};




export default jobSlice.reducer;

////ab ise use krne ke lie store.js me jao