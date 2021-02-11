const mongoose = require('mongoose');
const Product = require('./models/productSchema')
const dbUrl = "mongodb://localhost:27017/ddx_db"
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


const Products= [
  {
    productName:"BroEasy Tshirt green",
    stocks:[
      {
      size:"XL",
      stock:30
      },
      {
        size:"M",
        stock:35
        }
    ],

    category:"Tshirts",
    color:"Green",
    gender:"M",
    mrp:599,
    brand:"Bro Easy",
    Keyword:['shirt'],
    productDescription:"Lorem ipsum this is the best tshirt you will see at this price and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj_USse64PpgZa6WLE6IPAZlDqDgBxGflXwg&usqp=CAU","https://cdn.shopify.com/s/files/1/1650/5551/products/ARMY_GREEN_TSHIRT_ROUND_NECK_HALF_SLEEVES_MODEL_1200x.jpg?v=1578474451"]
  
  },
  {
    productName:"BroEasy Tshirt green",
    stocks:[
      {
      size:"XL",
      stock:30
      },
      {
        size:"M",
        stock:35
        }
    ],

    category:"Tshirts",
    color:"green",
    gender:"M",
    mrp:599,
    brand:"Bro Easy",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this price and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj_USse64PpgZa6WLE6IPAZlDqDgBxGflXwg&usqp=CAU","https://cdn.shopify.com/s/files/1/1650/5551/products/ARMY_GREEN_TSHIRT_ROUND_NECK_HALF_SLEEVES_MODEL_1200x.jpg?v=1578474451"]
  
  },
  {
    productName:"BroEasy Tshirt green",
    stocks:[
      {
      size:"XL",
      stock:30
      },
      {
        size:"M",
        stock:35
        }
    ],

    category:"Tshirts",
    color:"green",
    gender:"M",
    mrp:599,
    brand:"Bro Easy",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this price and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj_USse64PpgZa6WLE6IPAZlDqDgBxGflXwg&usqp=CAU","https://cdn.shopify.com/s/files/1/1650/5551/products/ARMY_GREEN_TSHIRT_ROUND_NECK_HALF_SLEEVES_MODEL_1200x.jpg?v=1578474451"]
  
  },
  {
    productName:"BroEasy Tshirt green",
    stocks:[
      {
      size:"XL",
      stock:30
      },
      {
        size:"M",
        stock:35
        }
    ],

    category:"Tshirts",
    color:"green",
    gender:"M",
    mrp:599,
    brand:"Bro Easy",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this price and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj_USse64PpgZa6WLE6IPAZlDqDgBxGflXwg&usqp=CAU","https://cdn.shopify.com/s/files/1/1650/5551/products/ARMY_GREEN_TSHIRT_ROUND_NECK_HALF_SLEEVES_MODEL_1200x.jpg?v=1578474451"]
  
  },
  {
    productName:"BroEasy Tshirt green",
    stocks:[
      {
      size:"XL",
      stock:30
      },
      {
        size:"M",
        stock:35
        }
    ],

    category:"Tshirts",
    color:"green",
    gender:"M",
    mrp:599,
    brand:"Bro Easy",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this price and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRj_USse64PpgZa6WLE6IPAZlDqDgBxGflXwg&usqp=CAU","https://cdn.shopify.com/s/files/1/1650/5551/products/ARMY_GREEN_TSHIRT_ROUND_NECK_HALF_SLEEVES_MODEL_1200x.jpg?v=1578474451"]
  
  },
  
]

  for(product of Products){
    let newProduct = new Product(product);
    newProduct.save();
  }


