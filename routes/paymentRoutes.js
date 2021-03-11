const express=require('express')
const router=express.Router()
const Razorpay=require('razorpay')
const Product=require('../models/productSchema')
const Order=require('../models/OrderSchema')
const payment= require('../controllers/payments');
const {User}=require('../models/userSchema')



const instance = new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
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
        req.session.orderId=order.id
        let orderPlaced= new Order({user:req.user,orderId:order.id,totalPrice:amt,address:req.user.address,paidAt:Date.now()});
        for(let pr of req.user.cartProducts){
            let foundProduct = await Product.findById(pr.pid);
            orderPlaced.orderItems.push({prid:pr.pid,name:pr.name,image:pr.image,size:pr.size,qty:pr.qty,price:foundProduct.sellingprice,})
        }
        let orderSaved=await orderPlaced.save()
        res.render('checkout',{order:orderSaved})
    });
    
})

router.post('/payment/success/',payment.checkSignature,async (req,res)=>{
    let {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body
   let order= await Order.findOneAndUpdate({orderId:razorpay_order_id},{paymentId:razorpay_payment_id,signature:razorpay_signature,isPaid:true},{new:true,useFindAndModify:false})
   //console.log(order)
   order.orderItems.forEach(async(pr)=>{
       let foundProduct= await Product.findById(pr.prid);
       foundProduct.stocks.forEach(stock=>{
           if(stock.size===pr.size){
               stock.units= stock.units-pr.qty;
           }
       })  
       await foundProduct.save();
   })
   let user=await User.findById(req.user.id)
   user.orders.push(order)
   user.cartProducts=[];
   await user.save()
    req.flash('success',"Order Placed")
    res.redirect('/products')
})


module.exports=router;