module.exports.isLoggedIn= (req,res,next)=>{
  if(!req.isAuthenticated()){
    req.flash('error','Please Log in to continue')
    return res.redirect('/login');
  }
  next();
}