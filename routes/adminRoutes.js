const express=require("express");
const customerController=require("../controller/customerController");
const adminController=require("../controller/adminController");
const Product=require("../models/Stock")
const invoice=require("../models/invoice")
const url=require("url")
var mkdirp=require('mkdirp');
var fs=require('fs-extra');
var resizeImg=require('resize-img')
const {forwardAuthenticated} = require("../config/auth")


const router=express.Router();

router.get("/",adminController.getIndexPage);
router.get('/about',adminController.getabout);
router.get("/new/product",adminController.addNewProductGet);
router.get('/products',adminController.getAllProducts);
router.get("/:id/edit",adminController.productEditGet);
router.get("/:id/delete",adminController.deleteProduct);
router.get("/products/suppliers",adminController.getAllSuppliers);
router.get("/supplier/:id/edit",adminController.supplierEditGet);
router.get("/supplier/:id/delete",adminController.deleteSupplier);
router.get("/customers/view",customerController.adminViewAllCustomer);
router.get("/cust/:id/delete",adminController.deleteCustomer)
router.post("/new/product",adminController.addNewProduct);
router.post("/:id/update",adminController.productEditPost);
router.post("/new/supplier",adminController.addNewSupplier);
router.post("/supplier/:id/update",adminController.supplierEditPost);   





router.get('/addinvoice',(req,res)=>{
        res.render('admin/AddInvoice');
      });
      
router.post("/add-invoice",(req,res)=>{
        //  console.log(req.body);
         let pro=new invoice(req.body);
         pro.save()
         res.redirect("/admin/display_invoices")
      
       });
      
router.get("/display_invoices",(req,res)=>{
        invoice.find({}, (err, invoice) => {
          if (err) {
            console.log('Error fetching products:', err);
            return;
          }
          res.render('admin/Disinvoice',{invoice:invoice})
          
        });
        })
      
        router.get("/invoice/(:id)/delete",function(req,res){
        
          invoice.findByIdAndRemove(req.params.id,(err,doc)=>{
             if(!err){
                res.redirect('/display_invoices')
             }
             else{
                console.log(err);
             }
          })
        })
        router.get("/invoice/(:id)/print",function(req,res){
        
          // console.log(req.params.id);
         invoice.findById(req.params.id,(err,invoice)=>{
              if(!err){
                 console.log(invoice)
                //  res.redirect('/printinvoice',{invoice:invoice})
                
        res.render('admin/PrintInvoice', { invoice });
      
              }
              else{
                 console.log(err);
              }
           })
        })
       
        router.get('/printinvoice',(req,res)=>{
          res.render('admin/PrintInvoice');
        });
      

module.exports=router;