import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: [3, "Name must conatin atleast 3 characters"],
        maxLength: [30, "Name cannot exceed 30 characters "]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide valid email."]
    },
    phone: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    niches: {
        // yaani muje web dev bhi aata hai , aur mobile dev, data scienec bhi aata hai 
        firstNiche: String,
        secondNiche: String,
        thirdNiche: String,
        
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "password must conatin atleast 8 charaacters "],
        maxLength: [32, "Password cannot exceed 32 characters"],
        select: false
    },
    resume: {
        public_id: String,
        url: String
    },
    coverLetter: {
        type: String
    },
    role: {
        type: String,
        required: true,
        enum: ["Job Seeker", "Employer"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },


});

// for password encrypted // pre metods userSchema ko kuch values asign krta hai jese methodes 
// yaani user schema ke save hone se phele uske password ko encrypt kr do 
userSchema.pre("save", async function(next){ // yaani agr user ka password modified nhai hua hai to aaapko next kr hi dena hai 
    if(!this.isModified("password")){
        console.log("modified  nahi hua hai");
        
        next()
    }
    // agr modified hua ya fir nya user register hua to ye krna hai 
    // console.log("modified  hua ");
    this.password = await bcrypt.hash(this.password, 10)
})


//////////////compare the password for login // ye ek  function ka naam hai comparePassword ye khuch bhi likh shakte ho 
userSchema.methods.comparePassword = async function(enteredPassword){
    // console.log(this.password);
    // console.log(enteredPassword);
    
    return await bcrypt.compare(enteredPassword, this.password); //enteredPassword jo ki user ne diya ha , aur this.password jo ki encrypted hai db me
}


// ye methode this ko chek krne ke liye mene banaya hai fir isko jwtToken.js me call kiya hai, this ka matlab ki ki upear wale schema me jo bhi hai agr usko muje access krna hai to this. ka use karunga 
// userSchema.methods.idTest = function(){
//     // console.log(this._id);
    
// }


// this used for jwt token from utils folder jwtToken.js
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    })// sign methode ek token ko generate krta hai , this._id means ki user ki id 
}






export const User = mongoose.model("User", userSchema);