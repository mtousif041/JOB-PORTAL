import mongoose from "mongoose";

export const connection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "JOB_PORTAL_WITH_KOIBHINAAM" //optional
    }).then(()=>{
        console.log("connected to databasee");
        
    }).catch(err=> {
        console.log(`while some error accured while connecting to database ${err}`);
        
    })
}