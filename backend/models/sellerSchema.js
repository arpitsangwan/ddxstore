const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./productSchema');

const SellerSchema = new Schema({
  userId:{
    type:Schema.Types.ObjectId,
    required:true
  },
  products:[{
    type:Schema.Types.ObjectId,
    ref:'Product'
  }],
  
});

module.exports = mongoose.model('Seller',SellerSchema);