const mongoose=require("mongoose");
const schema=mongoose.Schema;

const productschema=new schema({
        pname:{
        type:String,
        required:true,
    },
    costprice:{
        type:Number,
        required:true,
    },
    pprice:{
        type:Number,
        required:true,
    },
    pbatch:{
        type:String,
        required:true,
    },
    pbrand:{
        type:String,
        required:true,
    },
    pcatogory:{
        type:String,
        required:true,
    },
    pimage: {
        type: String,
        
      },
    quantity:{
        type:Number,
        required:true,
      },
    psupplier:{
        type:String,
        required:true,
    },
    pdescription:{
        type:String,
        required:true,
    },
    date: {
        type: Date,
        default: Date.now
      }
    
},{timestamps:true});

const Product=mongoose.model("product",productschema);
module.exports=Product;




