const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema=require('./OrderSchema')
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
  email:{
    type:String,
    unique:true,
    required:true,
  },
  password:{
    type:String,
    required:true
  },
  image:{
    type:String,
  },
  address:[AddressSchema],
  orders:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'OrderSchema'
    }
  ],
  isSeller:{
    type:Boolean,
    required:true,
    default:false,
  }
  
})

module.exports = mongoose.model('user',UserSchema);