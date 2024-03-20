const mongoose=require("mongoose");
const schema=mongoose.Schema;

const customerSchema=new schema({
customerName:{
    type:String,
    required:true,
},
customerMobileNumber:{
    type:String,
    required:true,
},
cus_address:{
    type:String,
    required:true,
},
password:{
    type:String,
    required:true,
},
isAdmin:{
    type:Boolean,
    default:false
},
date: {
    type: Date,
    default: Date.now
  }
},{timestamps:true})

const Customer=mongoose.model("customer",customerSchema);

module.exports=Customer;