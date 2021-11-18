const router = require('express').Router();
const Product = require('../models/product');
const { verifyTokenAdmin } = require('./verifyToken');

router.post("/",verifyTokenAdmin,async(req,res)=>{

    const newProduct = new Product(req.body);

    try{
        const product = await newProduct.save();
        res.status(200).send(
            {
                message:"Product added successfully",
                product: product
            }
        );
    }
    catch(err){
        res.status(500).send(err);
    }


});


router.put("/:id",verifyTokenAdmin,async(req,res)=>{

    try{
       
        const updateproduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
    
    
        res.status(200).json({
            message: "Product updated successfully",
        });
    
    }
    catch(err){
        res.status(500).send(err);
    }

});

//Delete

router.delete("/:id",verifyTokenAdmin, async (req, res) => {

    try{
        
        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Product deleted successfully",
        });
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }

});

//find product all user

router.get("/find/:id", async (req, res) => {

    try{
        const user = await Product.findById(req.params.id);
        const { password , ...userWithoutPassword } = user.toObject();
        res.status(200).json(userWithoutPassword);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }

});



router.get("/",async(req,res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try{
        let products;
     

        if(qNew){
            products = await Product.find({new:qNew}).limit(1);
        }
        else if(qCategory){
            products = await Product.find({
                categories:{
                    $in:qCategory
                },
            });
        }
        else{
            products = await Product.find();
        }

        res.status(200).json(products);
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }

});


module.exports = router;