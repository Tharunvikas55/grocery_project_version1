const express=require("express");
const passport = require('passport');
const authController=require("../controller/authController")

//const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated, forwardAuthenticated, isAdmin } = require('../config/auth');
const router=express.Router();

router.get("/login",forwardAuthenticated,authController.getLogin);
router.post("/login", authController.postLogin);
router.get('/logout',authController.logOut);

module.exports=router;


// router.post("/login",(req,res)=>{
//     let cus_mobile_no=req.body.cus_mobile_no;
//     let cus_password=req.body.cus_password;
//     customer.findOne({cus_mobile_no:cus_mobile_no},function(err,data){
//         if(err){
//             res.send(err);
//         }
//         else{
//             if(data==null){
//                 console.log("invalid user");
//                 res.send({status:0})
//             }
//             else{
//              if(cus_mobile_no==data.cus_mobile_no){
//                 if(cus_password==data.cus_password){
//                     if(data.role=='admin'){
//                         res.redirect("/admin/");
//                     }else{                        
//                         res.redirect("/customer/")       
//                         // res.send(id:data._id) 
//                     }
//                 }
//                 // let custid=data._id;
//                 // console.log(custid);
//                 else{
//                     console.log("password wrong");
//                     res.redirect("/");
//                 }                
//             }
//             else{
//                 console.log("invalid password");
//             }
//         }
//         }
//     })
// })

