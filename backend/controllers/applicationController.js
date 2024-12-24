import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import {v2 as cloudinary} from "cloudinary";


//////////////////////////////////////////////////////for posting a appllication
export const postApplication = catchAsyncErrors(async(req, res, next)=>{
        const {id} = req.params; // ye ek job ki id hogi
        const {name, email, phone, address, coverLetter} = req.body;

        if(!name || !email || !phone || !address || !coverLetter){
           return next(new ErrorHandler("All fields are required", 400))
        }

        const jobSeekerInfo = {
            id:req.user._id, // agr user login hai to uski id isse mil jayegi
            name,
            email,
            phone,
            address,
            coverLetter,
            role: "Job Seeker" // iska role har haal me job seeker hi hona cahye , kunyuki job seeker hi kisi application ke liye application ko post kr shakta hai 
        };

        const jobDetails = await Job.findById(id);

        if(!jobDetails){
           return next(new ErrorHandler("Job not found", 404));

        }


         ////ab ye check krna hai ki ye user is job ke liye phele bhi apply kr chuka hai yaa fir ye aabi abi apply krne aaya hai 
         const isAlreadyApplied = await Application.findOne({
            "jobInfo.jobId": id, // yaani ki agr jobInfo.id brabar hui hmari is id ke jo uper aai hui hai 
            "jobSeekerInfo.id": req.user._id  // yaani ye jobifo ki id aur joseeker ki id ye dono iske ander mili to means ki user phle bhi apply kr chuka hai  
        })

        if(isAlreadyApplied){
           return next(new ErrorHandler("you have already apply for this job", 400))

        }

        

        if(req.files && req.files.resume){ // yaani agr user ne koi file bheji aur uska naam resume hua to usko kese store krenge database me 
            const {resume} = req.files;
            try {
                const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath, {
                   folder: "Job_Seekers_Resume"
                });

                if(!cloudinaryResponse || cloudinaryResponse.error){//agr clodinaryResponse nhai hai ya fir usme koi error hua to 
                  return next(new ErrorHandler("failed to upload resume on claudinary", 500));
                }

                //ab aagr resume clodinary pe upload ho gya to ab usko jobSeekerInfo object me add krva do 
                jobSeekerInfo.resume = {
                    public_id: cloudinaryResponse.public_id,
                    url: cloudinaryResponse.secure_url
                }


            } catch (error) {
                return next(new ErrorHandler("Failed to upload resume", 500));
                
            }

        } else {
            if(req.user && !req.user.resume.url){ // yaani agr hmare pass req.user vo hua lekin resume ka url nhai hua to 
                return next(new ErrorHandler("Please Upload your resume", 400));
                
            }
         
            // ab agr hmare pass req.user vo hua aur uska resume ka url bhi hua to ,  jobSeekerInfo naam ka object hai usme ek resume naam ka feild add kro 
            jobSeekerInfo.resume = {
                public_id: req.user && req.user.resume.public_id, // yaani isbaar  public_id: me claudinaryResponse ki id nhai aayegi , kyunki isbaar user apna koi resume nhai bheja vo apna  purana uploaded on cloudinary wala resume hi use kr rha hai 
                url: req.user && req.user.resume.url,

            }

        }



        ///// ab hume employer ka info chaye 
        const employerInfo = {
            id: jobDetails.postedBy,
            role: "Employer"
        }


        //////ab hume job info chaye aur usme job id aur job title chaye 
        const jobInfo = {
            jobId: id,
            jobTitle: jobDetails.title
        } 

        ///////ab hume application ko create bhi krna hai  krna hai hai 
         const application  = await Application.create({
            jobSeekerInfo,
            employerInfo,
            jobInfo,
         });

         res.status(201).json({
            success: true,
            message: "Application Submitted Successfully",
            application
         })
        
    });

       






/////////////yaani employer apni saari application dhek sake jo logo ne post ki hai uski job ke liye ///////////////////////////////////////////////
export const employerGetAllApplication = catchAsyncErrors(async(req, res, next)=>{
    const {_id} = req.user; // req.user ke ander hmara pura user pda hua hai aur usme _id bhi hai 
    const applications = await Application.find({
        "employerInfo.id": _id, //yaani employerInfo.id brabar ho _id ke aur 
        "deletedBy.employer":false, // yaani employer ki traf se vo delete nhai hui ho , yaani jab mene kisi application post kiya aur user ne use apni aur se dalete kr diya ab vo user ko nhai dhikegi lekin me use dhek shakta hu
    });

    res.status(200).json({
        success:true,
        applications
    })

})



/////////////yaani job-seeker apni saari application dhek sake  ki usne kon konsi job ke liye apply kiya hai  ///////////////////////////////////////////////
export const jobSeekerGetAllApplication = catchAsyncErrors(async(req, res, next)=>{
    const {_id} = req.user; // req.user ke ander hmara pura user pda hua hai aur usme _id bhi hai 
    const applications = await Application.find({
        "jobSeekerInfo.id": _id, //yaani jobSeekerInfo.id brabar ho  _id ke aur 
        "deletedBy.jobSeeker":false, // yaani employer ki traf se vo delete nhai hui ho , yaani jab mene kisi application post kiya aur user ne use apni aur se dalete kr diya ab vo user ko nhai dhikegi lekin me use dhek shakta hu
    });

    res.status(200).json({
        success:true,
        applications
    })
})



//////////////////////////////////////////////////////////////for deleting application/////////////////////////////////
////ye application do side se delete hogi , ek to employer ki traf se aur dusra job-seeker traf se
export const deleteApplication = catchAsyncErrors(async(req, res, next)=>{
    const {id} = req.params; // yha pe hmaare pass id aayegi application jis application ko aap delete kr rhe ho
    const application = await Application.findById(id);
    if(!application){
        return next(new ErrorHandler("Application not found", 404));

    }

    const {role} = req.user; // hme pta hai req.user ke ander hmara pura user hai
    switch (role) {
        case "Job Seeker":
            application.deletedBy.jobSeeker = true;
            await application.save();
            break;
        case "Employer":
            application.deletedBy.employer = true;
            await application.save();
            break;
    
        default:
            console.log("Default case for application delete function");
            break;
        } 

        if(application.deletedBy.employer === true && application.deletedBy.jobSeeker === true){
            await application.deleteOne(); // yaani ye ab puri trha se database me se bhi delete ho jayegi
        }

        res.status(200).json({
            success:true,
            message:"Application Deleted."
        })
            

})