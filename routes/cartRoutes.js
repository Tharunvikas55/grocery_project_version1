const express=require("express");
const passport = require('passport');
const authController=require("../controller/authController")
const Product=require("../models/Stock");
const Cart=require("../models/Cart");

//const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated, forwardAuthenticated, isAdmin } = require('../config/auth');
const router=express.Router();

router.get('/:id/addtocart',function(req,res){
     var item=req.params.id;  
    //  console.log(item); 

    
     Product.findOne({_id:item},function(err,p){
         if(err)
         console.log(err);
         if(typeof req.session.cart=="undefined"){
            req.session.cart=[];
            req.session.cart.push({
                pid:p._id,
                title:p.pname,
                qty:1,
                price:parseFloat(p.pprice).toFixed(2),
                image:p.pimage
            });

        }
        else{
            var cart=req.session.cart;
            var newItem=true;

            for(var i=0;i<cart.length;i++){
                if(cart[i].title==p.pname){
                    cart[i].qty++;
                    newItem=false;
                    break;
                }
            }

            if(newItem){
                cart.push({
                    pid:p._id,
                    title:p.pname,
                    qty:1,
                    price:parseFloat(p.pprice).toFixed(2),
                    image:p.pimage
                })
            }
        }

        //console.log(req.session.cart);
        req.flash('success_msg',"product added!");
     res.redirect("/index");
    });

} );

router.get('/checkout',function(req,res){
    var cart=req.session.cart;
    // console.log(cart);
    if(req.session.cart&& req.session.cart.length==0){
        delete req.session.cart;
        res.redirect("/cart/checkout");
    }
    else{res.render('checkout',{
        cart:req.session.cart,title:"checkout",user:req.user
    });}
    
});

//get update product
router.get('/update/:product',function(req,res){
    var item=req.params.product; 
    var cart=req.session.cart;
    // console.log(cart);
    var action=req.query.action;
    
    
    for(var i=0;i<cart.length;i++){
        if(cart[i].title == item){
            
            switch(action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if(cart[i].qty<1) cart.splice(i,1);
                    break;
                case "clear":
                    cart.splice(i,1);
                    if(cart.length==0) delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }
    req.flash('success_msg',"cart updated!");
    res.redirect("/cart/checkout");
    
});


//clear cart
router.get('/clear',function(req,res){
        delete req.session.cart;
        req.flash('success_msg',"cart cleared");
        res.redirect("/cart/checkout");  
});


//Buy Now
router.get('/buynow',function(req,res){
    res.sendStatus(200); 
});


router.get('/confirm',function(req,res){
    const cartItems = req.session.cart || [];
    const items = cartItems.map(item => {
      return {
        productId: item.pid,
        title:item.title,
        quantity: item.qty,
        price: item.price,
        image: item.image
      };
    });
    const userId = req.user ? req.user._id : null; // assuming you are using passport.js for user authentication
    const cart = new Cart({
      userId: userId,
      items: items
    });
    cart.save(function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log('Cart saved successfully');
      }
    });
    req.flash('success_msg',"Ordered!");
        res.redirect("/cart/cartview"); 
})


router.get("/customer/view",(req,res)=>{
    const userId = req.user;
    Cart.find({ userId: userId }, function(err, carts) {
        if (err) {
            console.error(err);
          } else {
            carts.forEach(function(cart) {
            //   console.log('Cart ID:', cart._id);
            //   console.log('Items:');
            //   cart.items.forEach(function(item) {
            //     console.log('- productId:', item.productId);
            //     console.log('- title:', item.title);
            //     console.log('- image:', item.image);
            //     console.log('- Price:', item.price);
            //     console.log('- Quantity:', item.quantity);
            //   });
            //   console.log('------------------');
            res.render('customer/cartview',{cart,title:'carts',user:req.user})
            });
          }
})
});




module.exports=router;