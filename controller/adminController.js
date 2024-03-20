const Product=require("../models/Stock");
const supplier=require("../models/Supplier");
const Customer=require("../models/Customer");
var Catogory=require("../models/AdminCatogories")
var mkdirp=require('mkdirp');
var fs=require('fs-extra');
var resizeImg=require('resize-img')

exports.getIndexPage=(req,res)=>{
  
  res.render("admin/adminIndex",{title:"Admin"});
}
exports.getabout=(req,res)=>{
  
  res.render("admin/about",{title:"Admin"});
}

// stocks start
exports.getAllProducts=(req,res)=>{       
  
  Product.find().sort({ createdAt: -1 })
  .then(result=>{    
    res.render('admin/stockPage',{ products :result,title:"Stocks"});
  })
  .catch(err=>{
    console.log(err);
  });
}
exports.addNewProductGet=(req,res)=>{
  Catogory.find(function(err,catogories){
  res.render("admin/addStock",{title:"Admin", catogories:catogories});    
  })
}
exports.addNewProduct=(req,res)=>{
  // var imageFile=typeof req.files.image!=="undefined" ?req.files.image.name:"";
  const pro=new Product(req.body);
   pro.save( 
  //   if(err) return console.log(err);

  //   mkdirp('public/product_image/'+pro._id,function(err){
  //     return console.log(err);
  //   });

  //   mkdirp('public/product_image/'+pro._id+'/gallery',function(err){
  //     return console.log(err);
  //   });

  //   mkdirp('public/product_image/'+pro._id+'/gallery/thumbs',function(err){
  //     return console.log(err);
  //   });

  //   if (imageFile!==""){
  //     var productImage=req.files.image;
  //     var path='public/product_image/'+pro_id+'/'+imageFile;
  //     productImage.mv(path,function(err){
  //       return console.log(err);
  //     })
  //   }
  //  }
  )
    .then(result=>{
      res.redirect("/admin/products")
    })
    .catch(err=>{
      console.log(err);
    });
  }

exports.deleteProduct=(req,res)=>{
  Product.findByIdAndDelete(req.params.id)
  .then(result=>{
    res.redirect("/admin/products")
  })
  .catch(err=>{
    console.log(err);
  });
}

exports.deleteCustomer=(req,res)=>{
  Customer.findByIdAndDelete(req.params.id)
  .then(result=>{
    res.redirect("/admin/customers/view")
  })
  .catch(err=>{
    console.log(err);
  });
}
exports.deleteSupplier=(req,res)=>{
  supplier.findByIdAndDelete(req.params.id)
  .then(result=>{
    res.redirect("/admin/products/suppliers")
  })
  .catch(err=>{
    console.log(err);
  });
}

exports.productEditGet=(req,res)=>{
  const id = req.params.id;
  Product.findById(id)
  .then(result=>{
    res.render('admin/stockEdit',{ products:result,title:"Products"});
  })
  .catch(err=>{
    console.log(err);
  });
}

exports.productEditPost=(req,res)=>{
  const {pname,pbatch ,costprice, pprice , pbrand , pcatogory , quantity} = req.body; 
  const _id = req.params.id;
  Product.updateOne({_id:_id},{$set:{pname:pname,pbatch:pbatch,costprice:costprice, pprice:pprice , pbrand:pbrand , pcatogory:pcatogory , quantity:quantity}})
    .then((data)=>{
      res.redirect("/admin/products")
    })
    .catch((err)=>{
      console.log(err);
    })

  
}
//stocks end

//supplier start
exports.getAllSuppliers=(req,res)=>{
  supplier.find()
  .then(result=>{
      res.render('admin/supplier',{ suppl:result,title:"Suppliers"});
  })
  .catch(ree=>{
      console.log(err);
  });
}

exports.addNewSupplier=(req,res)=>{
  const s=new supplier(req.body);
  s.save()
  .then(result=>{
    res.redirect("/admin/products/suppliers")
  })
  .catch(err=>{
    console.log(err);
  });
}

exports.supplierEditGet=(req,res)=>{
  const id = req.params.id;
  supplier.findById(id)
  .then(result=>{
    res.render('admin/supplierEdit',{ supplier:result,title:"Supplier"});
  })
  .catch(err=>{
    console.log(err);
  });
}

exports.supplierEditPost=(req,res)=>{
  const {agencyname ,ownername, phone , catogory,GSTno } = req.body; 
  const _id = req.params.id;
  supplier.updateOne({_id:_id},{$set:{agencyname:agencyname,ownername:ownername, phone:phone , catogory:catogory,GSTno:GSTno }})
    .then((data)=>{
      res.redirect("/admin/products/suppliers")
    })
    .catch((err)=>{
      console.log(err);
    })

  
}

//supplier end