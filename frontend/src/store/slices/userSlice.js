import {createSlice} from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
    name: "user",
    initialState:{
        loading: false,
        isAuthenticated: false,
        user: {},
        error: null,
        message: null,
    },

    reducers:{
        //////////////////////////////////////////////
        registerRequest(state, action){ // yaani jab bhi hum registerRequest ko execute krenge to hum inki inki valu change krenege 
            state.loading = true;
            state.isAuthenticated = false;
            state.user = {};
            state.error = null;
            state.message = null;

        },


        registerSuccess(state, action){
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.error = null;
            state.message = action.payload.message;//ye message backend me se aayega 
        },

        registerFailed(state, action){
            state.loading = false;
            state.isAuthenticated = false;
            state.user = {};
            state.error = action.payload;
            state.message = null;
        },

         //////////////////////////////////////////////////
        loginRequest(state, action){ // yaani jab bhi hum registerRequest ko execute krenge to hum inki inki valu change krenege 
            state.loading = true;
            state.isAuthenticated = false;
            state.user = {};
            state.error = null;
            state.message = null;

        },


        loginSuccess(state, action){
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.error = null;
            state.message = action.payload.message;//ye message backend me se aayega 
        },

        loginFailed(state, action){
            state.loading = false;
            state.isAuthenticated = false;
            state.user = {};
            state.error = action.payload;
            state.message = null;
        },


       ///////////////////////// fetch user ke karan hum page ko refresh bhi krte hai to hmara user authenticated hi aayega agr vo loggin hua hai  to , yaani ab muje sayed redux ko persist krne ki jroorat nhai 
        fetchUserRequest(state, action){ ///////////////import in app.jsx
            state.loading = true;
            state.isAuthenticated = false;
            state.user = {};
            state.error = null;
        },
        fetchUserSuccess(state, action){
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        },
        fetchUserFailed(state, action){
            state.loading = false;
            state.isAuthenticated = false;
            state.user = {};
            state.error = action.payload;
        },

        ///////////////////////////////////////////////reducers for log out 
        logOutSuccess(state, action){
            state.isAuthenticated = false;
            state.user = {}; // logout success hone pr user ko epmty bhej dhenge 
            state.error = null;
        },
        logOutFailed(state, action){
            state.isAuthenticated = state.isAuthenticated;// yaani agr logout failed hua to isAuthenticated ki vo hi value rhegi jo phele thi 
            state.user = state.user;
            state.error = action.payload;
        },






        //////////////////////////////////////////////////////////


        clearAllErrors(state, action){
            state.error = null;
            state.user = state.user;
        },
    },
});



export const register = (data)=>async (dispatch)=>{ //data hmare register.jsx component  se jab user enter krega
    dispatch(userSlice.actions.registerRequest());
    try {
        // const response = await axios.post("http://localhost:5000/api/v1/user/register", data, {
        const response = await axios.post("http://192.168.43.226:5000/api/v1/user/register", data, {
            withCredentials: true,
            headers:{"Content-Type": "multipart/form-data"},
        })

        dispatch(userSlice.actions.registerSuccess(response.data));
        dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(userSlice.actions.registerFailed(error.response.data.message));
    }

};


export const login = (data)=> async(dispatch)=>{
    dispatch(userSlice.actions.loginRequest());
    try {
        // const response = await axios.post("http://localhost:5000/api/v1/user/login", data, {
        const response = await axios.post("http://192.168.43.226:5000/api/v1/user/login", data, {
            withCredentials: true,
            headers:{"Content-Type": "application/json"},
        })

        dispatch(userSlice.actions.loginSuccess(response.data));
        dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
        // console.log(error);
        
        dispatch(userSlice.actions.loginFailed(error.response.data.message));
    }

};



export const getUser = ()=>async(dispatch)=>{
    dispatch(userSlice.actions.fetchUserRequest());
    try {
        // const response = await axios.get("http://localhost:5000/api/v1/user/getuser", {
        const response = await axios.get("http://192.168.43.226:5000/api/v1/user/getuser", {
            withCredentials: true,
        })

        dispatch(userSlice.actions.fetchUserSuccess(response.data.user));
        dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(userSlice.actions.fetchUserFailed(error.response.data.message));
    }
}





export const logout = ()=>async(dispatch)=>{
    try {
        // const response = await axios.get("http://localhost:5000/api/v1/user/logout", {
        const response = await axios.get("http://192.168.43.226:5000/api/v1/user/logout", {
            withCredentials: true,
        })

        dispatch(userSlice.actions.logOutSuccess()); ///logOutSuccess(?) me bhi khuch bhejne ki jaroorat nhai kynki humne action.payload koi data use nhai kiya
        dispatch(userSlice.actions.clearAllErrors());
    } catch (error) {
        dispatch(userSlice.actions.logOutFailed(error.response.data.message));
    }
};




export const clearAllUserErrors = ()=>(dispatch)=>{//phela parenthesis me agr apko frontend mese koi value bhjni hai to vo aayega , aur dusre me hum dispatch kr lenge ya khuch aur kr leneg 
    dispatch(userSlice.actions.clearAllErrors())
}



export default userSlice.reducer; // hume reducer ko export krna hota hai naki actions ko


//////////////////////////////////////aap kisi slice ko direct use nhai kr shakte ho jab tak aap us slice ko store me configure na kro 