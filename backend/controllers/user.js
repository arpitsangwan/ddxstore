const {User} = require('../models/userSchema');
const {validateAddress}= require('../utils/joiSchema');
const myError = require('../utils/myerror');

module.exports.NewAddressForm=async(req,res)=>{
  res.render('user/newAddressForm');
};

module.exports.createAddress=async(req,res)=>{
  const {error}= validateAddress.validate(req.body.address);
  if(error){
     throw new myError(error.message,400)
  }
  let currentUser = new User(req.user);
  currentUser.address=(req.body.address);
  let savedUser = await currentUser.save();
  res.redirect('/cart');
};

module.exports.UpdateAddressForm=(req,res)=>{
  let address = req.user.address;
  res.render('user/editAddressForm',{address});
};
module.exports.getOrders=async(req,res)=>{
  let user = await User.findById(req.user).populate('orders');
  let orders= user.orders.reverse();
  res.render('user/orders',{orders})

};