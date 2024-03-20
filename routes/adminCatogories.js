var express=require("express");
var router=express.Router();
var Catogory=require("../models/AdminCatogories")
router.get("/",(req,res)=>{
    Catogory.find(function(err,catogories){
        if(err) return console.log(err);
        res.render('admin/adminCatogories',{title:catogories,catogories:catogories})
    })
})
router.post("/new/catogory",(req,res)=>{
    const catogory=new Catogory(req.body);
   catogory.save()
    .then(result=>{
      res.redirect("/admin/catogories")
    })
    .catch(err=>{
      console.log(err);
    });
});

router.get("/:id/catogory/edit",(req,res)=>{
    const id = req.params.id;
  Catogory.findById(id)
  .then(result=>{
    res.render('admin/adminCatogoriesedit',{ catogories:result,title:"Catogory"});
  })
  .catch(err=>{
    console.log(err);
  });
});
router.post("/:id/catogory/update",(req,res)=>{
    const {title,slug} = req.body; 
    const _id = req.params.id;
    Catogory.updateOne({_id:_id},{$set:{title:title,slug:slug}})
      .then((data)=>{
        res.redirect("/admin/catogories")
      })
      .catch((err)=>{
        console.log(err);
      })
  
    
});
router.get("/:id/catogory/delete",(req,res)=>{
    Catogory.findByIdAndDelete(req.params.id)
  .then(result=>{
    res.redirect("/admin/catogories")
  })
  .catch(err=>{
    console.log(err);
  });
});

module.exports=router;