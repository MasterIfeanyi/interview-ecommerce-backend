const User = require("../models/User");


const getUsers = async (req, res) => {
    try {
        // find all the users to send to the front-end
        const result = await User.find();
        if (!result) {
            res.status(400).json({ "message": "No users found" })
        }
        res.status(200).json(result); // everything was okay
    } catch (err) {
        return res.status(500).json({ "msg": err.message });
    }
}

const getAUser = async (req, res) => {
    if (!req?.params) return res.status(400).json({ "message": "params is required" });
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id }).exec();
        if (!user) {
            return res.status(400).json({ "message": `No User matches an ID ${id}.` });
        }
        res.status(200).json(user); // everything was ok
    } catch (err) {
        return res.status(500).json({ "msg": err.message });
    }
}

const updateUser = async (req, res) => {
    if (!req?.params) return res.status(400).json({ "message": "params is required" });
    const { id } = req.params;
    
    const data = {
        username: req.body.user,
        pwd: req.body.pwd,
        email: req.body.email,
        phone: req.body.phone,  
        gender: req.body.gender ?req.body.gender : "X"
    };
    
    try {
        const user = await User.findByIdAndUpdate(id, { $set: data });
        if (!user) {
            return res.status(400).send(`unable to update ${id}`);
        } 
           
        // find all the users to send to the front-end
        const result = await User.find();
        if (!result) return res.status(400).json({ "message": "No user found" });
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ "msg": err.message });
    }
}

const deleteUser = async (req, res) => {
    if (!req?.params) return res.status(400).json({ "message": "parameters are required" })
    const {id} = req.params
    try {
        const user = await User.findOne({ _id: id }).exec();

        if (!user) {
            return res.status(400).json({ "message": `No User matches an ID ${id}.` });
        }
        await user.deleteOne({ _id: id });

        // find all the users to send to the front-end
        const result = await User.find();
        if (!result) return res.status(400).json({ "message": "No users found" });
        res.status(200).json(result); // deleted no content to send back
    } catch (error) {
        return res.status(500).json({"msg" : err.message})
    }
}

module.exports = {getUsers, getAUser, deleteUser, updateUser}