const express=require("express");
const passport = require('passport');
const authController=require("../controller/authController")
const Product=require("../models/Stock");
const Cart=require("../models/Cart");

//const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated, forwardAuthenticated, isAdmin } = require('../config/auth');
const router=express.Router();


router.get('/add/:productId', async (req, res) => {
    
    console.log(req.params.productId);
    try {
      const product = await Product.findById(req.params.productId);
  
      if (!product) {
        return res.status(404).send('Product not found');
      }
  
      const cartItem = {
        productId: product._id,
        title: product.pname,
        quantity: req.body.quantity || 1,
        price: product.pprice,
        image: product.pimage,
        
        
      };
  
      const total=req.body.quantity*product.pprice;
      let cart = await Cart.findOne({ userId: req.user});
  
      if (!cart) {
        cart = new Cart({
          userId: req.user._id,
          items: [cartItem],
          total:total
        });
      } else {
        const index = cart.items.findIndex(item => item.productId.toString() === product._id.toString());
  
        if (index === -1) {
          cart.items.push(cartItem);
        } else {
          cart.items[index].quantity += cartItem.quantity;
          
        }
      }
  
      await cart.save();
      req.flash('success_msg',"product added!");
     res.redirect("/index");
      
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  // Route to remove a product from the cart
  router.get('/remove/:productId', async (req, res) => {
    try {
      const cart = await Cart.findOne({ userId: req.user });
  
      if (!cart) {
        return res.status(404).send('Cart not found');
      }
  
      const index = cart.items.findIndex(item => item.productId.toString() === req.params.productId.toString());
  
      if (index === -1) {
        return res.status(404).send('Product not found in cart');
      }
  
      cart.items.splice(index, 1);
  
      await cart.save();
      res.redirect('/cart/get')
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
  // Route to get the cart of a user
  router.get('/get', async (req, res) => {
   console.log( req.session.totalAmount);
    try {
      const cart = await Cart.findOne({ userId: req.user});
      console.log(cart);
  
      if (!cart) {
        return res.status(404).send('Cart not found');
      }
  
    res.render('customer/cart1',{cart,title:"cart",user:req.user})
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  router.get('/clear', async (req, res) => {
    try {
      const cart = await Cart.findById({ userId: req.user});
      cart.items = []; // Update items array with an empty array
      await cart.save();
      req.flash('success_msg',"cleared!");
     res.redirect("/index");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });





module.exports=router;