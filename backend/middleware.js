const Product = require("./models/productSchema");

module.exports.isLoggedIn= (req,res,next)=>{
  if(!req.isAuthenticated()){
    req.flash('error','Please Log in to continue')
    return res.redirect('/login');
  }
  next();
}

module.exports.isSeller=(req,res,next)=>{
  if(!req.user.isSeller){
    req.flash('error','You are not authorised for this!');
    return res.redirect('/');
  }
  next();
}
module.exports.isOwner= async(req,res,next)=>{
  let foundProduct = await Product.findById(req.params.id);
  let result = foundProduct.listedBy.equals(req.user._id);
  if(!result){
    req.flash('error',"Oops! You are not authorised for this!");
    res.redirect('/login');
  }
  next();

}