const router = require('express').Router();
const { verifyToken,verifyTokenAndAuth,verifyTokenAdmin } = require("./verifyToken");
const  User  = require("../models/user");

router.put("/:id",verifyTokenAndAuth, async (req, res) => {


if(req.body.password){

    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();
}

try{
 
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {new: true});


    res.status(200).json({
        message: "User updated successfully"
    });

}catch(err){
    console.log(err);
    res.status(500).send(err);
}

});

router.delete("/:id",verifyTokenAndAuth, async (req, res) => {

    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "User deleted successfully"
        });
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }

});

//find any user only admin

router.get("/find/:id",verifyTokenAdmin, async (req, res) => {

    try{
        const user = await User.findById(req.params.id);
        const { password , ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }

});

//find all user only admin

router.get("/all_user",verifyTokenAdmin, async (req, res) => {

    try{
        
        const users = await User.find();
        res.status(200).json(users);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }

});



module.exports = router;