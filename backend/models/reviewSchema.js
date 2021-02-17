const mongoose = require('mongoose');
const User = require('./userSchema')
const Schema = mongoose.Schema;
const Product = require('./productSchema')

const ReviewSchema = new Schema({
  // rating:{
  //   type:Number,
  //   required:true
  // },
  review:{
    type:String,
  },
    author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true,
      unique:true
    },
   authorName:{
     type:String,
     required:true
   }
  // productId:{
  //   type:mongoose.Schema.Types.ObjectId,
  //   ref:'Product'
  // }
})
module.exports = mongoose.model('Review',ReviewSchema)
