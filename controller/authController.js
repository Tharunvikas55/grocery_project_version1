const Product=require("../models/Stock");
const Customer=require('../models/Customer');
const passport = require('passport');
const { ensureAuthenticated, forwardAuthenticated,isAdmin } = require('../config/auth');

exports.getLogin=(req,res)=>{
    // console.log(req.session.isLoggedIn);
        res.render("login");
}

exports.postLogin=(req,res)=>{  

    // req.session.isLoggedIn=true;
    // res.redirect("/");
    
    passport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/login',
        failureFlash: true
      }   
    )(req, res);   
   
    
      
}

// exports.logOut=(req, res) => {
//     req.logout();
//     //req.flash('success_msg', 'You are logged out');
//     res.redirect('/');
//   }

exports.logOut=(req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");
    });
  };


  exports.registerGet=(req,res)=>{
    res.render("customer/signup",{title:"signUp"})
  };