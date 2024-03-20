const mongoose=require("mongoose");
const schema=mongoose.Schema;
const invoiceSchema=new schema({
    invoiceno:{
        type:Number,
        required:true,
    },
    invoicedate:{
        type:String,
        required:true,
    },
    fname:{
        type:String,
        required:true,
    },
    phno:{
        type:Number,
        required:true,
    },
    add:{
        type:String,
        required:true,
    },
    price:{
        type:[Number],
        required:true,
    },
    product_name: {
        type: [String],
        required: true
      },
    quantity:{
        type:[Number],
        required:true
    },
    total:{
        type:[Number],
        required:true,
    },
   
    
},
{timestamps:true});

const invoice=mongoose.model("invoice",invoiceSchema);
module.exports=invoice;