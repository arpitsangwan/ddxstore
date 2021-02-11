const mongoose = require('mongoose');
const Product = require('./models/productSchema')


const Products= [
  {
    productName:"BroEasy Tshirt Black",
    unitPrice:299,
    size:"XL",
    category:"Tshirts",
    stock:34,
    brand:"Bro Easy",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this price and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:[{url:"https://rukminim1.flixcart.com/image/811/973/kflftzk0-0/t-shirt/h/f/m/s-m7ss18tee066g-metronaut-original-imafwyf7dmsun6gn.jpeg?q=50"}]
  
  },
  {
    productName:"BroEasy Tshirt Orange",
    unitPrice:219,
    size:"L",
    brand:"Bro Easy",
    category:"Tshirts",
    stock:22,
    productDescription:"Lorem ipsum this is the best tshirt you will see at this price and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:[{url:"https://rukminim1.flixcart.com/image/811/973/jjlqxe80/t-shirt/7/a/m/m-m7ss18tee066f-metronaut-original-imaf757rwjzwjq7u.jpeg?q=50"}]
    

  },
  {
    productName:"Solid Men Round or Crew Grey T-Shirt",
    unitPrice:299,
    size:"XL",
    category:"Tshirts",
    stock:34,
    brand:"Bro Easy",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this price and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:[{url:"https://rukminim1.flixcart.com/image/811/973/jjlqxe80/t-shirt/k/w/y/m-m7ss18tee066e-metronaut-original-imaf757rzwe5tkzf.jpeg?q=50"}]
    

  },
  {
    productName:"Solid Men V Neck Dark Blue T-Shirt",
    unitPrice:399,
    size:"XL",
    category:"Tshirts",
    stock:34,
    brand:"Bro Easy",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this price and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:[{url:"https://rukminim1.flixcart.com/image/811/973/kfcv6vk0-0/t-shirt/e/q/o/m-msp19ccn013a-metronaut-original-imafvtrkmgrdbjuj.jpeg?q=50"}]
    

  },
  {
    productName:"BroEasy Tshirt Black",
    unitPrice:299,
    size:"XL",
    category:"Tshirts",
    stock:34,
    brand:"Bro Easy",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this unitPrice and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:[{url:"https://rukminim1.flixcart.com/image/811/973/kkec4280/jacket/4/e/w/m-jc-344anavy-woodland-original-imafzr8psu8ahzzq.jpeg?q=50"}]
    

  },
  {
    productName:"Printed Men Round Neck Dark Blue T-Shirt",
    unitPrice:299,
    size:"XL",
    category:"Tshirts",
    stock:34,
    brand:"Billion",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this unitPrice and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:[{url:"https://rukminim1.flixcart.com/image/811/973/k5zn9u80/t-shirt/z/5/y/m-bss20cnfs19c-billion-original-imafzk4azgh7ek8d.jpeg?q=50"}]
    

  },
  {
    productName:"BroEasy Tshirt Black",
    unitPrice:299,
    size:"XL",
    category:"Tshirts",
    stock:34,
    brand:"Bro Easy",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this unitPrice and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:[{url:"https://rukminim1.flixcart.com/image/811/973/kihqz680-0/jacket/i/m/c/m-bogrhdjacket-kt2-blive-original-imafy9htftjfgayw.jpeg?q=50"
  }]
    
  },
  {
    productName:"Men Cargos",
    unitPrice:599,
    size:"XL",
    category:"Lowers",
    stock:34,
    brand:"Bro Easy",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this unitPrice and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:[{ url:"https://rukminim1.flixcart.com/image/811/973/jepzrm80/cargo/s/e/m/32-p92-doricargoblack-plus91-original-imaf3ckgpy5fcw5q.jpeg?q=50"
  }]
   
  },
  {
    productName:"Men Cargos",
    unitPrice:699,
    size:"XL",
    category:"Tshirts",
    stock:34,
    brand:"Hymen Legions",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this unitPrice and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:[{url:"https://rukminim1.flixcart.com/image/811/973/kflftzk0/cargo/h/9/h/34-3d4-urban-legends-original-imafwyxfbds538v6.jpeg?q=50"}]
    

  },
  {
    productName:"Printed Men Round Neck Black T-Shirt",
    unitPrice:499,
    size:"XL",
    category:"Tshirts",
    stock:34,
    brand:"DDX",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this unitPrice and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:[{url:"https://rukminim1.flixcart.com/image/811/973/kflftzk0/cargo/h/9/h/34-3d4-urban-legends-original-imafwyxfbds538v6.jpeg?q=50"}]
    

  },
  {
    productName:"Printed Men Round Neck Grey T-Shirt",
    unitPrice:199,
    size:"S",
    category:"Tshirts",
    stock:34,
    brand:"Bro Easy",
    productDescription:"Lorem ipsum this is the best tshirt you will see at this price and is very comfortable to wear as well as to make this right in the factory hub of textile industry of india which is gurgaon",
    images:[{url:"https://rukminim1.flixcart.com/image/811/973/k55n0y80/t-shirt/9/z/s/xl-t-227-scatchite-original-imafnwk8ydbfkzzm.jpeg?q=50"}]
    

  },
]

let seedDB= ()=>{
  for(product of Products){
    let newProduct = new Product(product);
    newProduct.save();
  }
}

module.exports = seedDB;
