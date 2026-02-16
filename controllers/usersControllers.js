const userModels = require('../models/Users');

const getAllUsers = async (req, res) => {

    const all_users = await userModels.find().select("-password").lean();


    if(!all_users.length){
        res.status(400).json({message:"No users found"})
    }


    res.status(200).json(all_users)
};

module.exports = {
    getAllUsers,
};