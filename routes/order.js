const router = require('express').Router();
const Order = require('../models/order');
const { verifyTokenAdmin,verifyTokenAndAuth,verifyToken } = require('./verifyToken');


//add order
router.post("/",verifyTokenAndAuth,async(req,res)=>{

    const newOrder = new Order(req.body);

    try{
        const order = await newOrder.save();
        res.status(200).send(
            {
                message:"Order added successfully",
                order:order
            }
        );
    }
    catch(err){
        res.status(500).send(err);
    }


});

//get all cart items
router.put("/:id",verifyTokenAdmin,async(req,res)=>{

    try{
       
         await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});
    
    
        res.status(200).json({
            message: "Order updated successfully",
        });
    
    }
    catch(err){
        res.status(500).send(err);
    }

});

//Delete

router.delete("/:id",verifyTokenAdmin, async (req, res) => {

    try{
        
        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Order deleted successfully",
        });
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }

});

//get user cart user

router.get("/find/:userId", verifyTokenAndAuth ,async (req, res) => {

    try{
        const order = await Order.find({ userId: req.userId});
        res.status(200).json(order);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});



router.get("/",verifyTokenAdmin,async(req,res)=>{

    try{
        const orders = await Order.find();
        res.status(200).json(orders);

    }catch(err){
        res.status(500).send(err);
    }
});

//get income

router.get("/income", verifyTokenAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router;