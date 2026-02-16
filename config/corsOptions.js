const allowedOrigins = require('./allowedOrigins')


const corsOptions = {
    origin:(origin , callback)=> {
        if(allowedOrigins.includes(origin) || (!origin && process.env.NODE_ENV == "development") ){
            callback(null , true)
        }else{
            callback(new Error("Not allowed by cors"))
        }
    },
    credentials:true,
    optionsSuccessStatus:200

}


module.exports = corsOptions