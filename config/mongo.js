const mongoose = require("mongoose");


 

async function ConnectDB() {

    try {
        
        await mongoose.connect(process.env.DATABASE_URI)
        console.log("is connection")

    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = ConnectDB