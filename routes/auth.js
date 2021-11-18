const router = require('express').Router();
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');


//Register

router.post("/register", async (req,res) => {

    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
    });

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch(err){
        res.status(400).json({message : err.message});
    }

});


//Login

router.post("/login", async (req,res) => {

    try{

        const user = await User.findOne({username : req.body.username});
        !user && res.status(404).json({message : "User not found"});
        const Originalpassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        Originalpassword !== req.body.password && res.status(400).json({message : "Incorrect password"});

        const accesstoken = jwt.sign({
        _id : user._id,
        isAdmin : user.isAdmin
        }, process.env.JWT_SECRET, {expiresIn : "3d"});

        const { password , ...userWithoutPassword } = user.toObject();

        res.status(200).json({...userWithoutPassword,accesstoken});

    }
    catch(err){
        res.status(400).json({message : err.message});
    }

});


module.exports = router;