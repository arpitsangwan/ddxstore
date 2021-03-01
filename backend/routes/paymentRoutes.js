const express=require('express')
const router=express.Router()
const Razorpay=require('razorpay')
const Product=require('../models/productSchema')
const Order=require('../models/orderSchema')
const crypto = require("crypto");
const {User}=require('../models/userSchema')


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
    if(!req.user.address){
        res.redirect('/user/address/new');
    }
    let user=await User.findById(req.user.id)
    let products=user.cartProducts;
    let amt=0;

    for(let pr of products){
        let product=await Product.findById(pr.pid)
        amt+=parseInt(product.sellingprice)*parseInt(pr.qty)
    }
/*     let {id}=req.body
    let data=await Product.findById(id) */
    var options = {  
        amount: amt*100,  // amount in the smallest currency unit 
        currency: "INR",
       // receipt: 'order_rcptid_11'
    };
    instance.orders.create(options,async (err, order)=> { 
        //console.log(order)
        req.session.orderId=order.id
        let orderPlaced= new Order({user:req.user,orderId:order.id,totalPrice:amt,address:req.user.address});
        for(let pr of req.user.cartProducts){
        orderPlaced.orderItems.push(pr.pid)
        }
        let orderSaved=await orderPlaced.save()
        res.render('checkout',{order:orderSaved})
    });
    
})
router.post('/payment/success/',checkSignature,async (req,res)=>{
    let {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body
   let order= await Order.findOneAndUpdate({orderId:razorpay_order_id},{paymentId:razorpay_payment_id,signature:razorpay_signature,isPaid:true},{new:true,useFindAndModify:false})
   //console.log(order)
   let user=await User.findById(req.user.id)
   user.orders.push(order)
   user.cartProducts=[];
   await user.save()
    req.flash('success',"Order Placed")
    res.redirect('/products')
})


module.exports=router;