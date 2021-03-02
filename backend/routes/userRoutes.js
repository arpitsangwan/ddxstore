const router = require('express').Router()
const {isLoggedIn}= require('../middleware');
const {User} = require('../models/userSchema')

router.get('/address/new',async(req,res)=>{
  res.render('user/newAddressForm');
})
router.get('/address/edit',(req,res)=>{
  let address = req.user.address;
  console.log(address);
  res.render('user/editAddressForm',{address});
})

router.post('/address',async(req,res)=>{
  let currentUser = new User(req.user);
  currentUser.address=(req.body.address);
  let savedUser = await currentUser.save();
  console.log((currentUser));
  res.redirect('/profile');
})

router.get('/orders',async(req,res)=>{
  let user = (await User.findById(req.user)).populate('orders');;
  let orders;
  for(let order of user.orders){
    
  }
  res.render('user/orders',{orders})

})

module.exports= router;
