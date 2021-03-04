const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {User} = require('./userSchema')



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
  /* city:{
    type:String,
    required:true
  }, */
  state:{
    type:String,
    required:true
  }

});


const OrderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderId:{ 
    type:String,
    required:true,
    unique:true
  },
  trackingId:{
    type:String,
  },
  address:AddressSchema,
  // email:{
  //   type:String,
  //   required:true
  // },
  orderItems: [
    {
      name: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true }, 
        qty: { type: Number, required: true },
       size: { type: String, required: true },
        prid:{type: mongoose.Schema.Types.ObjectId,required: true,ref: 'Product'}
     
    }
  ],
  paymentId: {
    type: String
  },

  /* paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String },
  }, */
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  signature:{
    type:String
  }


})
module.exports=mongoose.model('Order',OrderSchema);