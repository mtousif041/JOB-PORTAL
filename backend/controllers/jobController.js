import { catchAsyncErrors } from "../middlewares/catchAsyncError.js"; 
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";


/// for posting a job 
export const postJob = catchAsyncErrors(async(req, res, next)=>{
    const {title, jobType, location, companyName, introduction, responsibilities, qualifications, offers, salary, hiringMultipleCandidates, personalWebsiteTitle, personalWebsiteUrl, jobNiche} = req.body;

    if(!title || !jobType || !location || !companyName || !introduction || !responsibilities || !qualifications ||  !salary || !jobNiche){
        return next(new ErrorHandler("Please Provide full job details", 400))
    }

    if((personalWebsiteTitle && !personalWebsiteUrl) || (!personalWebsiteTitle && personalWebsiteUrl)){
        return next(new ErrorHandler("Provide Both the website url and title , or leave both blank", 400))

    }

    const postedBy = req.user._id;
    const job = await Job.create({
        title, 
        jobType, 
        location, 
        companyName, 
        introduction, 
        responsibilities, 
        qualifications, 
        offers, 
        salary, 
        hiringMultipleCandidates, 
        personalWebsite:{
           title: personalWebsiteTitle, 
           url: personalWebsiteUrl, 
        },
        jobNiche,
        postedBy

    })


    res.status(201).json({
        success:true,
        message: "Job posted successfully",
        job
    })

})


/////////////////////////get All jobs & get jobs by filter by city, niche , searchKeyword
export const getAllJobs = catchAsyncErrors(async(req, res, next)=>{
  const {city, niche, searchKeyword} = req.query;
  //http:localhost:5173/blogs/hhjsifs5454gf2583?keyboard=data science
  //hhjsifs5454gf2583 ye ek params hai 
  //?keyboard=data science ye ek query 
  
  
  const query = {};
  if(city){
    // console.log(city);
    query.location = city; // yaani ab me query ke ander ek field add krunga location naam aur usme city ki value dedunga 
  }     
  if(niche){
    // console.log(niche);
    query.jobNiche = niche; 
  }     
  if(searchKeyword){
    // console.log(searchKeyword);

    query.$or = [ // $or ka matlab ki inmese agr kisi se bhi search kiya to , vo phele title me dhekega agr mil gya to thik , istrha companyName bhi dhekega , aur introduction me bhi search krega 
        {title: {$regex: searchKeyword, $options: "i"}}, // i for incaseSensitive
        {companyName: {$regex: searchKeyword, $options: "i"}},
        {introduction: {$regex: searchKeyword, $options: "i"}}
    ];
  }   
  
  // console.log(query);
  
  
  const jobs = await Job.find(query); // yaani query wali jobs find krke do 


  res.status(200).json({
    success:true,
    jobs,
    count: jobs.length
  })
})




//////////////////////////get my jobs
export const getMyJobs = catchAsyncErrors(async(req, res, next)=>{
  // console.log(query);// ye uper wale function ka khuch bhi isme kaam nahi krega 
  
   const myJobs = await Job.find({postedBy: req.user._id});
   res.status(200).json({
    success:true,
    myJobs
   });
}); 




///////////////////////////for deleting a jobs 
export const deleteJob = catchAsyncErrors(async(req, res, next)=>{
    const {id} = req.params; // yaani req.params me se hum job ki id get krenge taki hum , aur us id se us job ko delete kr sake 
    const job = await Job.findById(id);

    if(!job){ // ye us waqt bhi kaam aayega , yaani jab apne job delete krdi aur  page refresh nhai hua aur aapne firse usi job ko delete krne ke liye button dbaya to req ko job milegi hi nhai aur server crash ho jayega 
        return next(new ErrorHandler("Oops! job not found", 404))
    }

    await job.deleteOne();

    res.status(200).json({
        success: true,
        message: "Job deleted"
    })

}) 




////////////////get a single job
export const getASingleJob = catchAsyncErrors(async(req, res, next)=>{
        const {id} = req.params;
        const job = await Job.findById(id);

        if(!job){ 
            return next(new ErrorHandler("job not found", 404))
        }

      res.status(200).json({
        success:true,
        job,
      })
    
})




