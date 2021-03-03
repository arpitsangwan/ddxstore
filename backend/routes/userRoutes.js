const router = require('express').Router()
const {isLoggedIn}= require('../middleware');
const {User} = require('../models/userSchema')
const catchAsync = require('../utils/catchAsync');
router.use(isLoggedIn);  
router.get('/address/new',catchAsync(async(req,res)=>{
  res.render('user/newAddressForm');
}))
router.get('/address/edit',(req,res)=>{
  let address = req.user.address;
  console.log(address);
  res.render('user/editAddressForm',{address});
})

router.post('/address',catchAsync(async(req,res)=>{
  let currentUser = new User(req.user);
  currentUser.address=(req.body.address);
  let savedUser = await currentUser.save();
  res.redirect('/profile');
}))

router.get('/orders',catchAsync(async(req,res)=>{
  let user = await User.findById(req.user).populate('orders');
  let orders= user.orders.reverse();
  res.render('user/orders',{orders})

}))

module.exports= router;
