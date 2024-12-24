import express from "express";
// import {config} from "dotenv";
import dotenv from "dotenv";

import cors from "cors";
import cookieParser from "cookie-parser";
import {connection} from "./database/connection.js"
import { errorMiddleware } from "./middlewares/error.js";
import fileUpload from "express-fileupload";
import userRouter  from "./routes/userRouter.js"
import jobRouter  from "./routes/jobRouter.js"
import applicationRouter  from "./routes/applicationRouter.js"
import { newsLetterCron } from "./automation/newsLetterCron.js";

const app = express();
dotenv.config(); 

//yha pr hum config.env file ka path set krnege 
// config({path: "./config/config.env"})

// yha pr hum frontend aur backend ka connection krenge by cors
app.use(cors({
    // origin: [process.env.FRONTEND_URL], 192.168.43.226
    origin:'http://192.168.43.226:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],  // yaani me ye charo methods frontend se apne backend me run kr saku 
    credentials: true,
}));

// jwt
app.use(cookieParser());// jab hum apne user ko login krvate hai ya register krvatehai us time hmare pass ek token generate hota hai , agr us token ko generate hone ke baad us token ko aapko yha pr apne backend folder me access krna ho to app.use(cookieParser()) ka parser use krenege // agr isko use nahi krenge to jese hi refresh krenge user ka logout ho jaayega knyuki backen ko token nahi milega browser se   

//isse ye pta lgega ki jo data arha hai vo kis type ka hai 
app.use(express.json());//  ye hmare pass jo data hai usko return krta hai json formate me 
app.use(express.urlencoded({extended: true}));// ye ye kaam krta hai ki maanlo aapne ek field bnai hai number formate ke liya aur aap agr ab aap usme array bhej rhe ho to ye error de deta

///express-fileupload : cloudinary se file ko get krne ke liye hota hai , ye multer ka alternative hai 
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))


app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);


//for automation by cron
newsLetterCron();


//database calling
connection();


// for errHandling middleware
app.use(errorMiddleware) // right way
// app.use(errMiddleware()) wrong way 



export default  app; // ab is app ko server.js me import krlo