import app from "./app.js"; // hum .js ext es6 me likhte hai sayed 
import cloudinary from "cloudinary";


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
    
})

app.listen(process.env.PORT, "0.0.0.0", ()=>{
    console.log(`Server listening on ${process.env.PORT}`);
    
});

