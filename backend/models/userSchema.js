const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema=require('./orderSchema')
const Cart=new mongoose.Schema({
  pid:{
    type:mongoose.Schema.Types.ObjectID,
    ref:'Product'
  },
  name:String,
  size:String,
  qty:Number,
  mrp:Number,
  image:String
})


const AddressSchema = new Schema({
  fullname:{
    type:String,
    required:true
  },
  mobileNumber:{
    type:String,
    required:true
  },
  pincode:{
    type:Number,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  landmark:{
    type:String,
  },
  town:{
    type:String,
  },
  city:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  }

})



const UserSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  cartProducts:[Cart],
  email:{
    type:String,
    unique:true,
    required:true,
  },
  image:{
    type:String,
    default:'https://image.shutterstock.com/image-vector/man-avatar-profile-male-face-600w-471975115.jpg'
  },
  address:AddressSchema,
  orders:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Order'
    }
  ],
  isSeller:{
    type:Boolean,
    required:true,
    default:false,
  },
  // Seller:{
  //   type:Schema.Types.ObjectId,
  //   ref:'Seller'
  // },
  
})

module.exports.User = mongoose.model('User',UserSchema);
module.exports.Cart=mongoose.model('Cart',Cart)
