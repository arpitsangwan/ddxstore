const router = require('express').Router()
const passportSetup = require('../config/passportSetup');
const passport = require('passport');
const {Cart}=require('../models/userSchema')
const {User}=require('../models/userSchema')

const cartTransfer=async (req)=>{
  let user=await User.findById(req.user.id)
  for(let prod of req.session.cartProducts){
    let{pid,size,qty,mrp,image,name}=prod
    let cartProd=new Cart({pid,name,size,qty,mrp,image}) 
    user.cartProducts.push(cartProd)
    await user.save()
  }
 // console.log(req.session.cartProducts)
  req.session.cartProducts=null;
  req.session.save();  
 
}

router.get('/google',passport.authenticate('google',{
  scope:['profile','email']
}))
router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
  if(req.session.cartProducts){
  cartTransfer(req);}
  req.flash('success',`Welcome Back! ${req.user.name}`)
  res.redirect('/profile');
})
router.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/');
})


router.get('/facebook',passport.authenticate('facebook',{
  scope:['email']
}))
router.get('/facebook/redirect',passport.authenticate('facebook'),(req,res)=>{
  req.flash('success',`Welcome Back! ${req.user.name}`)
   res.redirect('/profile');
  
})

module.exports = router;