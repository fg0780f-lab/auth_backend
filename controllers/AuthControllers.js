const UserModels = require('../models/Users')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const generated_token = require("../middleware/generated_token")




// Move it later to the error handling file
const validator = (password, email, res) => {
    if (email.indexOf("@") === -1) {
        res.status(400).json({ message: "Email is invalid" });
        return false;
    };

    if (password.length < 8) {
        res.status(400).json({ message: "password so short" });
        return false;

    };
    return true;
};



// Register function
const register = async (req, res) => {

    try {
        const { first_name, last_name, password } = req.body;

        const email = req.body.email.trim().toLowerCase()

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        };

        const isValid = validator(password, email, res)

        if (!isValid) return;

        const foundUser = await UserModels.findOne({ email: email }).exec();
        if (foundUser) {
            return res.status(401).json({ message: "user already exists" });
        };


        const passwordHash = await bcrypt.hash(password, Number(process.env.PASSWORD_SALT))
        const user = await UserModels.create({
            first_name,
            last_name,
            email,
            password: passwordHash,
        });

        const { access_token } = generated_token(res, user)

        res.status(201).json({
            token: access_token,
            user: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                createdAt:user.createdAt,
                updatedAt:user.updatedAt,
            }
        })

    } catch (error) {

        // sendOnMyEmail(error, { message: "حدث كاتش اثناء تسجيل الحساب يرجئ من فريق الصبانة مراجعة البريد" })

        res.status(500).json({
            message: "Internal Server Error. Please try again later",
        })
    }
};

// Login function
const login = async (req, res) => {

    try {

        const { password } = req.body;
        const email = req.body.email.trim().toLowerCase()
        if (!email || !password) {
            return res.status(400).json({ message: "all fields are required" });
        };

        const isValid = validator(password, email, res)

        if (!isValid) return;


        const user = await UserModels.findOne({ email: email }).exec();

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        };

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }



        const { access_token } = generated_token(res, user)

        res.status(200).json({
            token: access_token,
            user: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                createdAt:user.createdAt,
                updatedAt:user.updatedAt,
            }
        })


    } catch (error) {
        // sendOnMyEmail(error, { message: "حدث كاتش اثناء تسجيل الدخول يرجئ من فريق الصبانة مراجعة البريد" })
        res.status(500).json({
            message: "Internal Server Error. Please try again later",
        })
    };
}


// Refresh token function
const refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorization " });

    const token = cookies.jwt;
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if(err) return res.status(403).json({message:"Forbidden"});
        const user = await UserModels.findById(decoded.userInfo.id).exec();
        if(!user) return res.status(401).json({ message: "Unauthorization " });
        const { access_token } = generated_token(res, user);

        res.json({access_token})
    })


};

// logout function 

const logout = (req , res) => {

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);
    res.clearCookie("jwt" , {
        httpOnly:true,
        sameSite:"None",
    })
    res.json({message:"logout scsuus"})
}




module.exports = {
    register,
    login,
    refresh,
    logout,
}




