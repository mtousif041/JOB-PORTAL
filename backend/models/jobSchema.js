import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    jobType: {
        type:String,
        required:true,
        enum: ["Full-time", "Part-time"]
    },
    location: {
        type:String,
        required:true
    },
    companyName: {
        type:String,
        required:true
    },
    introduction: {
        type:String
    },
    responsibilities: {
        type:String,
        required:true
    },
    qualifications: {
        type:String,
        required:true
    },
    offers: {
        type:String
    },
    salary: {
        type:String,
        required:true
    },
    hiringMultipleCandidates: {
        type:String,
        default: "No",
        enum:["Yes", "No"]
    },
    personalWebsite: { //personalWebsite  me hmare pass title bhi hai aur url bhi hai 
       title: String,
       url: String
    },
    jobNiche: { //iske uper hum aage automation krenge 
            type:String,
            required:true
    },
    newsLettersSent: {//iske uper hum aage automation krenge 
        type:Boolean,
        default: false
    },
    jobPostedOn: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId, // iska mtlab hai ki hmare pass ek id aane wali hai 
        ref: "User", //isme hum model ka naam dete hai , isko do ya na do koi farak nahi pdtha
        required:true
    },
});

export const Job = mongoose.model("Job", jobSchema);