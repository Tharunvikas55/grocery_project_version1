const express=require("express");
const customerController=require("../controller/customerController");
const Product=require("../models/Stock");
const authController=require("../controller/authController")

const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
//const { forwardAuthenticated } = require('../config/auth');

const router=express.Router();


router.get("/register",forwardAuthenticated,authController.registerGet);
router.get('/index',ensureAuthenticated,customerController.index);
router.get('/allproducts',ensureAuthenticated,customerController.allproducts);
router.get("/contact",ensureAuthenticated,customerController.getContactForm);
router.get("/:id/details",ensureAuthenticated,customerController.getProductDetails);
router.post("/register",customerController.signUpPost);
//router.post("/:id/addtocart",ensureAuthenticated,customerController.addToCart);

module.exports=router;