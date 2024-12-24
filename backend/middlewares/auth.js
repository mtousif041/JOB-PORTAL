import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken"


export const isAuthenticated = catchAsyncErrors(async (req, res, next)=>{// ye function subse phele ek token ko get krega aur check krega ki user authenticate hai ki nhai 
    const {token} = req.cookies; // yaani hume apni saari cookies me se token naam ki cookie leke aani hai 
    if(!token){
        // console.log("token nahi mila"); agr toke ko "" krdiya fir token khali ho jata hai means ki token nahi mila 
        return next(new ErrorHandler("User is not authenticated", 400));
        
    }

    // agr user authenticated hai to hum uske token jariye uski  payload ki value get krenge ,payload yaani uska aalag aalag data jese id, name vgera vgera usme se  muje us user ki id get krni hai jo loggedin hua hai , jis id ko humne userSchema me getJWTToken function me diya tha 
    const decoded =  jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("token mil gya ");
    
    

// ab us user ko get krna hai jo logged hua hai 
 //req.user  yaani me req.user ke ander us user ko store krvana chata hu , taaki aage function me as a middleware hum is user ko access kr shak e
//  console.log("////////////////////////////////////////");
    // console.log(decoded);
    // console.log(decoded.id);
    
//  console.log(req.user);
//  console.log("////////////////////////////////////////");
    
    req.user = await User.findById(decoded.id);
    req.tousif = await User.findById(decoded.id);

    // console.log(req.user);
    // console.log(req.tousif);
    

    next();
});

// is isAuthenticated function se hum ye bhi kr shkate hai user agr logout ho gya hai to vo dobara se logout nhai ho shakta 





///////////////////////////for job employer yaani job dene wale ke liye 

export const isAuthorized = (...roles)=>{//yani ye user ke diffrente roles ko accept krta hai, agr ye 3 dots na bhi de tab bhi cahlega  
    return(req, res, next)=>{ // ye ek new function ko parameters ko return krva deta hai 
        if(!roles.includes(req.user.role)){ // yha pe includes methods se hum ye check krenge ki jo req.user.role se jo string aai hai , agr vo roles me nhai(!) hai to hum error de dhenge 
            return next(new ErrorHandler(`${req.user.role} not allowed to access this resource`))
        }


        next(); // agar matche kr gye to ye next usko aage bhej dega , 
    }
}