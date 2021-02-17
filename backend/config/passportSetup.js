const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/userSchema');
const FacebookStrategy=require('passport-facebook')

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
      done(err, user);
  });
});
passport.use(new FacebookStrategy({
  clientID:'440876164006143',
  clientSecret:'3c31a1d485ac30fd0c700fe20c5d9f63',
  callbackURL:"/auth/facebook/redirect",
  profileFields: ['id', 'emails', 'name']
},
async (accessToken,refreshToken,profile,done)=>{
 // console.log(profile);
 let {email,first_name,last_name}=profile._json
 let foundUser=await User.findOne({email})
 if(foundUser){
   return done(null,foundUser)
 }
 else{
   let name=first_name +''+last_name;
   let newUser=new User({
     name:name,
     email:email
   })
   let userCreated=await newUser.save()
   console.log(userCreated);
   done(null,userCreated) 
 }
}))

passport.use(new GoogleStrategy({
  //options
  callbackURL:"/auth/google/redirect",
  clientID:'727116452928-fbd7eqojotcpbi84gqgbha8l07g1ij74.apps.googleusercontent.com',
  clientSecret:'thZc2-1dY1wfzQDddLsz-1p-'
},async(accessToken,refreshToken,profile,done)=>{
  // passport callback function
  // console.log("in callback function ");
  // console.log(profile); <--this is the profile we recieve from google 
  let foundUser = await User.findOne({email:profile._json.email}); 
  if(foundUser){
   // console.log("already registered user",foundUser);
     return done(null,foundUser);
  }
  let newUser = new User({
    name:profile._json.name,
    email:profile._json.email,
    
    image:profile._json.picture
  })
  
  let userCreated = await newUser.save();
  // console.log('new user created :',userCreated);
  done(null,userCreated);
  
}))

