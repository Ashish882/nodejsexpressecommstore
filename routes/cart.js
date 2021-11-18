const router = require('express').Router();
const Cart = require('../models/cart');
const { verifyTokenAdmin,verifyTokenAndAuth,verifyToken } = require('./verifyToken');


//add to cart
router.post("/",verifyToken,async(req,res)=>{

    const newCart = new Cart(req.body);

    try{
        const cart= await newCart.save();
        res.status(200).send(
            {
                message:"Product added to cart successfully",
                cart:cart
            }
        );
    }
    catch(err){
        res.status(500).send(err);
    }


});

//get all cart items
router.put("/:id",verifyTokenAndAuth,async(req,res)=>{

    try{
       
         await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
    
    
        res.status(200).json({
            message: "Product cart updated successfully",
        });
    
    }
    catch(err){
        res.status(500).send(err);
    }

});

//Delete

router.delete("/:id",verifyTokenAndAuth, async (req, res) => {

    try{
        
        await Cart.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Product deleted successfully",
        });
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }

});

//get user cart user

router.get("/find/:userId", verifyTokenAndAuth ,async (req, res) => {

    try{
        const cart = await Cart.findOne({ userId: req.userId});
        res.status(200).json(cart);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});



router.get("/",verifyTokenAdmin,async(req,res)=>{

    try{
        const carts = await Cart.find();
        res.status(200).json(carts);

    }catch(err){
        res.status(500).send(err);
    }
});


module.exports = router;