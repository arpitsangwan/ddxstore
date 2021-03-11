const mongoose = require('mongoose');
const {User} = require('./models/userSchema');
const Seller = require('./models/sellerSchema');
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const dbUrl = process.env.DB_URL ||"mongodb://localhost:27017/ddx_db"
mongoose.connect(dbUrl,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then(()=>{
  console.log(`Database connection created at ${dbUrl}`)
})
.catch((err)=>{
  console.log("Something went wrong while connecting to the database "+ err);
})

let email= 'yadavification@gmail.com';

let makeAdmin = async(email)=>{
  let foundUser = await User.findOne({email:email});
  if(!foundUser.Seller){
  let sellerInstance = new Seller({
    userId:foundUser._id,
    products:[],
  })
  let savedSeller = await sellerInstance.save()
  foundUser.isSeller=true;
  foundUser.Seller=savedSeller._id;
  let savedUser = await foundUser.save();
  console.log("saved user is : ",savedUser)
  }
  let foundUser1 = await (await User.findOne({email:email})).populate('Seller');
  console.log(foundUser1);
}

makeAdmin(email);