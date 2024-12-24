
export const catchAsyncErrors = (theFunction) => {  // ye khud ek function ko accept krega as a parameter , aur ye rturn krega req, res, aur next ko 
    return (req, res, next) => {
        Promise.resolve(theFunction(req, res, next)).catch(next); // isme catch me humko next krna hai // hum basically ye ke rahe hai ki agr ye function isko run kro agr isme khuch error hua to fir catch ko run kr dena 
    }

}