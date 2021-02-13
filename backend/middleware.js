module.exports.isLoggedIn= (req,res,next)=>{
  if(!req.user){
    return res.redirect('/');
  }
  next();
}