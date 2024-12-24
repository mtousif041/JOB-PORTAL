import { catchAsyncErrors } from "../middlewares/catchAsyncError.js"; 
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import {v2 as cloudinary} from "cloudinary";
import {sendToken} from "../utils/jwtToken.js"


/// user register 
export const register = catchAsyncErrors(async(req, res, next)=> {
    try {
        const {name, email, phone, address, password, role, firstNiche, secondNiche,  thirdNiche, coverLetter } = req.body;

        if(!name || !email || !phone ||  !address || !password || !role){
            return next(new ErrorHandler("All Fieldss Are Required", 400)); // jab bhi error handler ka use kro to new likh diya kro varna error aayega

        }

        if(role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)){
            return next(new ErrorHandler("Please Provide your niches", 400)); // yaani agar user job seeker hua to usko ye niches bhi dhene pdenge 
        }
         
        // ab hum dhekenge ki 
        const existingUser = await User.findOne({email});
        if(existingUser){
            return next(new ErrorHandler("Email is already registered", 400));
        }

        const userData = {
            name, 
            email, 
            phone, 
            address, 
            password, 
            role, 
            niches: { // ye niches hmare userSchema ke ander bhi ek object ke ander hai isliye create krte waqt bhi ise ek object ke ander dena hoga 
            firstNiche, 
            secondNiche,  
            thirdNiche 
        },
            coverLetter
        };

        // now for resume 
        if(req.files && req.files.resume){ // yaani agr user ne frntend se file bheji aur uska naam resume hua to fir hum resume ko get kr lenge 
            const {resume} = req.files;
            if(resume){
                try {
                    const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath, //yaani us resume ka muje file path cahiye 
                        {folder: "Job_Seekers_Resume"} // yaani ki cloudinary me hmari file is folder me save honi chaye
                    )

                    if(!cloudinaryResponse || cloudinaryResponse.error){// yaani agr cloudinaryResponse nhai hai ya fir agr hai to aur usme koi error hua to 
                        return next(new ErrorHandler("Failed to upload resume to cloud", 500))

                    }

                    // agr ab shai se file aagya to userData ke ander ek nya field add krdo resume ka , jisme do values hogi public id and url
                    userData.resume = {
                        public_id: cloudinaryResponse.public_id, // ye id cloudinary se aayegi
                        url: cloudinaryResponse.secure_url

                    }
                } catch (error) {
                    return next(new ErrorHandler("Failed to upload resume", 500));
                    
                }
            }
            
        }

        // ab user ko save krna hai data base me 
        const user = await User.create(userData);
        sendToken(user, 201, res, "User Registered"); // ab ye sub parameter jayenge sendToken function me 

        // res.status(201).json({
        //     success: true,
        //     message: 'User Registered SuccesFully'
        // })

    } catch (error) { 
       next(error);
        
    }
});


///////////////////////////for login 
export const login = catchAsyncErrors(async(req, res, next)=>{

  const {role, email, password} = req.body;
  if(!role || !email || !password){
    return next(new ErrorHandler("Email, password and role are equiuired", 400));
  }

  const user = await User.findOne({email}).select("+password");

  if(!user){
    return next(new ErrorHandler("invalid email or password", 400));
}
 
// ab agr email mil gya to hum password ko match krege 
const isPasswordMatched = await user.comparePassword(password);
if(!isPasswordMatched){
    return next(new ErrorHandler("invalid email or password", 400));
}


// ab agar password bhi matched ho gya to hum role check krenege
if(user.role !== role){
    return next(new ErrorHandler("invalid user role", 400));
}

// ab sub khuch match ho gya to user ko login krva hi do
sendToken(user, 200, res, "User logged in successfully")

});


/////////////////////////for logout
export const logout = catchAsyncErrors(async(req, res, next)=>{
    res.status(200).cookie("token", "", { 
        // expires: new Date(// aur ye options same hone chaye jo aapne jwtToken me diye the 
        //     Date.now()// yaani is token me is wqt remove karna chata hu ya expire krna chata hu 
        // ),
        httpOnly: true,
    }).json({
        success:true,
        message: "Logged out successfully"
    })
})



/////// yha pe ek function likhte hai ki user apne aapko get kr shake 
export const getUser = catchAsyncErrors(async(req, res, next)=>{ // getUser isAuthenticated ke ander ke saare resources ko access kr sahkta hai jese req.user, isAuthenticated middleware ki vajaha se 
    const user = req.user; 
    // const userTousif = req.tousif;   // dono kaam kr rahe hai 
    res.status(200).json({
        success:true,
        user,
    });

});



///////////////////////ab ek function ho jha pr user apni profile ko update kr shake 
export const updateProfile = catchAsyncErrors(async(req, res, next)=>{
    const newUserData = { // yaani user ka nya data 
         name: req.body.name,
         email: req.body.email,
         phone: req.body.phone,
         address: req.body.address,
         address: req.body.address,
         coverLetter: req.body.coverLetter,
         niches:{
            firstNiche: req.body.firstNiche,
            secondNiche: req.body.secondNiche,
            thirdNiche: req.body.thirdNiche,
         }
    }

    // console.log(req.tousif)
    // console.log(req.user.resume.public_id);
    // console.log(req.user.resume.url);//purani wali ki link aur publick id aayegi
    // console.log(req.files.resume);//isse nai wali file agr fir se upload ki hai to aayegi  wali ki link aur publick id aayegi
    
     
    // hmare newUserData ke ander jo niches padi hui hai me unko destructure kr rha hu 
    const {firstNiche, secondNiche, thirdNiche} = newUserData.niches;

    if(req.user.role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)){
        return next(new ErrorHandler("Please Provide Your All preferred niches", 400));
    }

    // ab aage vo apni resume yaani file ko update krna chaye 
    if(req.files){
        const resume = req.files.resume;// is dono trikho se aap get kr shakte ho
        // const {resume} = req.files;
        if(resume){ // agr resume hai to hum kiya krenge ki user ki jo current resume hai usko get krne ki kosis krenege , aur uski purani wali resume ko nai vali se update kr denge 
            const currentResumeId = req.user.resume.public_id; //yaani jo purani wali resume hai uski id 

            if(currentResumeId){ // matlab agr ki user ne register hote waqt resume add kiya tha to apko mil jayega 
               await cloudinary.uploader.destroy(currentResumeId); // yaani isme purane wale resume ko cloudinary me se destroye kr dhenege, distorey methode ek ek public id mangta hai cloudinary ki 
            }

            // yaani ab new resume ko cloudinary pr upload krenge 
            const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
                folder: "Job_Seekers_Resume"
            });

            
            newUserData.resume = {
                public_id: newResume.public_id,
                url: newResume.secure_url,
            };

        }
    }


    // isse uper wala code sirf resume ke liya tha ab body ke liye 
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, { //ab hume khuch option dene hote hai data update krne ke liye 
        new: true,
        runValidators: true,
        useFindAndModify: false

    });

    res.status(200).json({
        success:true,
        user,
        message: "Profile updated succesfully"
    })
});



///////////////////for password updating 
export const updatePassword = catchAsyncErrors(async(req, res, next)=>{
    
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);//req.body.oldPassword ye vo password hai jo ki user ne enter kiya hai 

    if(!isPasswordMatched){ /// yaani agr ye password matched nhai hota to hume ek error dena hai 
        return next(new ErrorHandler("your password is incorrect", 400))
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("new password & confirm password do not match", 400))
    }

    ///now update the user password with new password
    user.password = req.body.newPassword;
    await user.save(); //ab user ko save krdo 
    sendToken(user, 200, res, "Password updated successfully");// yaani ab new token generate krva do 

});





