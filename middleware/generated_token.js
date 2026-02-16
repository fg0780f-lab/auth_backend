const jwt = require("jsonwebtoken");
const generated_token = (res, user) => {
    const access_token = jwt.sign({
        userInfo: {
            id: user._id,
            first_name: user.first_name
        }

    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES });


    const refresh_token = jwt.sign({
        userInfo: {
            id: user._id,
            first_name: user.first_name
        }
    }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }); // max Age at refresh token and cookise is (==> process.env.REFRESH_TOKEN_EXPIRES <==) after this time you need login agin 


    res.cookie("jwt", refresh_token, {
        httpOnly: true, // accessible by web server
        secure: process.env.NODE_ENV === "production" , //=> https
        sameSite: "None",
        maxAge: Number(process.env.COOKISE_EXPIRES), // cookies expiresIn: 7 days
    })
    return {access_token}
}

module.exports = generated_token