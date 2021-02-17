const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = require('./productSchema');

const SellerSchema = new Schema({
  products:[{
    type:Schema.Types.ObjectId,
    ref:'Product'
  }],
  
});


module.exports = mongoose.model('Seller',SellerSchema);