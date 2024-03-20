const Customer=require("../models/Customer");
const Product=require("../models/Stock");
const Cart=require("../models/Cart");
const bcrypt = require('bcryptjs');
const passport = require('passport');

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
//const { forwardAuthenticated } = require('../config/auth');

exports.signUpPost=(req, res) => {  
    const { customerName, customerMobileNumber, password, password2,cus_address,role } = req.body;
    let errors = [];
  
    if (!customerName || !customerMobileNumber || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('customer/signup', {
        errors,
        customerName,
        customerMobileNumber,
        password,
        password2,title:"signUp"
      });
    } else {
      Customer.findOne({ customerMobileNumber: customerMobileNumber }).then(customer => {
        if (customer) {
          errors.push({ msg: 'customer already exists' });
          res.render('customer/signup', {
            errors,
            customerName,
            customerMobileNumber,
            password,
            password2,
            cus_address,role,title:"signUp"
          });
        }
        else {
          const newUser = new Customer({
            customerName,
            customerMobileNumber,
            password,
            cus_address,role
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(customer => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  };

exports.index=(req,res)=>{
    Product.find()
  .then(result=>{
    res.render("index",{products :result,title:"index", user: req.user});
  })
  .catch(err=>{
    console.log(err);
  });
}

//admin view the customer details
exports.adminViewAllCustomer=(req,res)=>{
  Customer.find()
  .then(result=>{
    res.render('admin/adminCustomerView',{ customers :result,title:"All Customers"});
  })
  .catch(err=>{
    console.log(err);
  });
}
exports.allproducts=(req,res)=>{
  Product.find()
  .then(result=>{
    res.render("all_products",{products :result,title:"index", user: req.user});
  })
  .catch(err=>{
    console.log(err);
  });
}


exports. getProductDetails=(req,res)=>{
  const id = req.params.id;
  Product.findById(id)
    .then(result => {
      res.render('customer/productDetails', { products: result, title: 'Product Details',user:req.user });
    })
    .catch(err => {
      console.log(err);
      
    });
}

exports. addToCart=(req,res)=>{
  const cartnew=new Cart(req.body)
  cartnew.save()
  .then(result=>{
    res.redirect("/index");
  })
  .catch(err=>{
    console.log(err);
   });
}

exports.getContactForm=(req,res)=>{
  res.render("customer/contact",{title:"contact"});
};

