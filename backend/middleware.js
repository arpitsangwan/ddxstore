module.exports.isLoggedIn= (req,res,next)=>{
  if(!req.user){
    res.redirect('/');
  }
  next();
}