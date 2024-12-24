export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken();
    //  user.idTest()
    

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true, // httpOnly ko agr true nhai kroge to aapka token to generate hoga lekin usme kaafi saare issue rhange 

    };

    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        message,
        token
    });
}; 

// ab yha se getJWTToken ko copy krke userSchema models me use krenge 