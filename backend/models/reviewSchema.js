const mongoose = require('mongoose');
const User = require('./userSchema')
const Schema = mongoose.Schema;
const Product = require('./productSchema')

const reviewSchema = new Schema({
  rating:{
    type:Number,
    required:true
  },
  review:{
    type:String,
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product'
  }
})
module.exports = mongoose.model('review',reviewSchema)