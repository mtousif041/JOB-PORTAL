// isme hum error handinling // hmare pass ek class hoti hai Error naam  ki node js me 

class ErrorHandler extends Error{ // yaani is ErrorHandler ke ander ab Error ke saare functions honge, aur hum khuch aur bhi add kr shakte, message ko hum apni parents class Error se get krenge super ke through , aur statusCode hmari parents class ke ander exist nhai krta vo hum nya bna rhe hai usko hum this. se bnayege 
    constructor(message, statusCode){
        super(message); // ye jo message aayega ye Error class se aayega isko super keyword se get krenge 
        this.statusCode = statusCode; // status code hmari error class me exist nahi krta islye hum this.statusCode se ek nahi varibale bna rahe hai aur fir usme statusCode daal rahe hai 

    }
}

// abhi is class ko kaam krvane ke liye hume ek middleware bnana hai 
export const errorMiddleware = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error.";

    if(err.name === "CastError"){
        // CastError means ki maanlo aapne kha ki user ka name string formate me hona chaye lekin agr user ne koi aur formate daal diya to aapko aayega CastError , aur agr aapne kha ki user ke naam me 10 alphabates require hai agr user ne 9 daal diye to aayega cast error 
        const message = `Invaliddd ${err.path}`;
        err = new ErrorHandler(message, 400)
    }

    if(err.code === 11000){
        // ye 11000 error tab aata hai jab dabse ka uri ya db ke name me  koi gadbhad ho to tab ye error aayga , ya apne validation lgayi hai ki hmaare pass email unique honi chaye ye error tab aayega  
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered.`
        err = new ErrorHandler(message, 400)
    }

    if(err.name === "JsonWebTokenError"){
        const message = `Json web token invalid, try again`;
        err = new ErrorHandler(message, 400)
    }

    if(err.name === "TokenExpiredError"){
        const message = `Json Web  Token is expired , login again`;
        err = new ErrorHandler(message, 400)
    }

    return res.status(err.statusCode).json({
        success:false,
        message: err.message,
        // err: err // isse aap pta kr shakte ki err me kon konsi err hoti hai  
    })
}

export default ErrorHandler;

// ab isko app.js me subse end me use kr lenge 
