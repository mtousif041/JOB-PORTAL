import cron from "node-cron";
import {Job} from '../models/jobSchema.js';
import {User} from '../models/userSchema.js';
import {sendEmail} from '../utils/sendEmail.js'


// yha pr aapko ek function create krna hoga email bhejne ke liye// aur ye us job seeker ko email bhejga jiski niche posted job niche/title se match hogi 
export const newsLetterCron = () => {
    // agr kisi task ko apko schedule krna ho to uske liye aapko node_cron ka use krenge, hum set interval se bhi scheduling ka kaam kr shakte but node-cron ka use krna jada easy hai aur simple bhi hai 
    // cron.schedule("* * * * *", async()=>{// phela * yaani ye kitne minuts ke baad execute hoga , dusra * ghanto ke liye yaani kite ghante baad, 3sra days ke liye ki kitne dino ke baad aap execute krvana chate hai , 4th star ki yaani aap isko kis mhaine me execute krna chate ho means ki agr me 12 dedu to ab ye december ke mhaine me ekbaar run hoga , 5th me agr 5 dedu to yaani ab ye week ke 5ve din yaani wednesday ko run hoga 

    //Note agr aapka server crash ho jaaye tab bhi ye node cron cahlega 

    cron.schedule("*/1 * * * *", async()=>{// yaani me ise run krvana chata hu har ek minut ke baad , aur ab newsLetterCron()  app.js me call bhi krna pdega 
        // console.log("Running news letter cron automation");

        /// sabse phle jitni bhi jobs hai jinki news letter send nhai hue hai unko get krunga 
        const jobs = await Job.find({newsLettersSent: false}); // yaani un sab jobs ko get kro jinki newsLettersSent ki value false hai 
        for(const job of jobs){ // job ko aap khuch bhi naam de shakte ho 
            try {
                const filteredUsers = await User.find({
                    $or:[// iska matlab hai inmme se agr ek true hua to apko true return krna hai 
                        {"niches.firstNiche": job.jobNiche}, //niches.firstNiche yaani user ki jo first nich hai  agr vo match krti hai job ko jobNiche se to un users ko filter krna hai 
                        {"niches.secondNiche": job.jobNiche},
                        {"niches.thirdNiche": job.jobNiche},
                    ]//yaani ki user ki 1st 2nd 3rd me se koi bhi niche agar jobNiche me se mathc kr jaye to usko filter krna hai 
                })

                // ab agr user filter ho gye ssare , to ab vaapas is loop ko users ke liye run krenge 
                for(const user of filteredUsers){
                    const subject = `Hot Job alert ${job.title} in  ${job.jobNiche} available now`;// email ka jo bhi subject hoga use aap ider likh lena 
                    const message = `hi ${user.name}, \n\n great news! a new job that fits your niches has just been posted. the position is for a ${job.title} witj ${job.companyName}, and they are looking to hire immidiately .\n\n job details:\n -**Position:**${job.title}\n- **Company:**${job.companyName}\n-**Location:**${job.location}\n- **salary:** ${job.salary}\n\n dont wait to long! `;

                    // ab apko email ko bhej dena hai 
                    sendEmail({  // ye sendEmail function sendEmail.js me se aa rha hai  
                        email: user.email, //yaani email ko ispr bheja hai 
                        subject,
                        message
                    })
                }

                job.newsLettersSent = true; // yaani ab is value ko true krdo , ki jitne bhi users te jinki job niches match hoti hai un sabko email bhi chali gayi,  ab dobara jab ye run hoga to is job ko filter nhai krega 

                await job.save();

            } catch (error) {
                console.log("Error in Node Cron catch block");
                return next(console.error(error || "some error in crone"))
                
            }
        }

        
    }) 

}