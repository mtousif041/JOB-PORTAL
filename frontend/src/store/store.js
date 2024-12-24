// basically redux stage managment aur stages ko store krvane ke liye use hota hai 
import {configureStore} from '@reduxjs/toolkit';
import jobReducer from './slices/jobSlice';
import userReducer from './slices/userSlice';
import applicationReducer from './slices/applicationSlice';
// import UpdateProfileReducer from './slices/UpdateProfileSlice';
import updateProfileReducer from './slices/updateProfileSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        jobs: jobReducer,  //hum iska name change kr shakte hai jobSlice ki jgha hum ise jobReducer me import karlenge, kyunki humne ise export default export kiya hua hai to hum is koi bhi naam de shakte hai 
        applications: applicationReducer,
        // updateProfile: UpdateProfileSlice, // rename kiya gya hai 
        //  updateProfile: UpdateProfileReducer, 
         updateProfile: updateProfileReducer, 

    }
});


export default store;