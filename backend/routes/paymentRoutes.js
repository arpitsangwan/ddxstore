const express=require('express')
const router=express.Router()
const Razorpay=require('razorpay')
const Product=require('../models/productSchema')
const Order=require('../models/orderSchema')
const crypto = require("crypto");
const User=require('../models/userSchema')


const checkSignature=(req,res,next)=>{
const hmac = crypto.createHmac('sha256', 'tEXGaWqbhF06JgiQG9MoCy7V');

hmac.update(req.session.orderId + "|" + req.body.razorpay_payment_id);
let generatedSignature = hmac.digest('hex');


let isSignatureValid = generatedSignature == req.body.razorpay_signature;
    

  if (isSignatureValid) {
   return next()
  }
  req.flash('error','Payment failed')
  res.redirect('/products')
}

const instance = new Razorpay({
    key_id: 'rzp_test_R41PjHReUPGRt1',
    key_secret: 'tEXGaWqbhF06JgiQG9MoCy7V',
  });

router.get('/payment',(req,res)=>{
    res.render('payment')
})

router.post('/',async (req,res)=>{
    let products=req.session.cartProducts;
    let amt=0;

    for(let pr of products){
        amt+=parseInt(pr.mrp)
    }
    let {id}=req.body
    let data=await Product.findById(id)
    var options = {  
        amount: amt*100,  // amount in the smallest currency unit 
        currency: "INR",
       // receipt: 'order_rcptid_11'
    };
    instance.orders.create(options,async (err, order)=> { 
        //console.log(order)
        req.session.orderId=order.id
        let orderPlaced=await new Order({user:req.user,orderId:order.id,totalPrice:amt})
        let orderSaved=await orderPlaced.save()
        res.render('checkout',{order:orderSaved})
    });
    
})
router.post('/payment/success/',checkSignature,async (req,res)=>{

   let order= await Order.findOneAndUpdate({orderId:req.body.razorpay_order_id},{paymentId:req.body.razorpay_payment_id,signature:req.body.razorpay_signature,isPaid:true},{new:true,useFindAndModify:false})
   //console.log(order)
   let user=await User.findById(req.user.id)
   user.orders.push(order)
   await user.save()
    console.log(user)
    req.flash('success',"Order Placed")
    res.redirect('/products')
})


module.exports=router;