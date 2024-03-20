const mongoose=require("mongoose");
const schema=mongoose.Schema;

const supplierschema=new schema({

    agencyname:{
        type:String,
        required:true,
    },
    ownername:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    GSTno:{
        type:String,
        required:true,
    },
    catogory:{
        type:String,
        required:true,
    },
    date: {
        type: Date,
        default: Date.now
      }

},{timestamps:true});

const supplier=mongoose.model("supplier",supplierschema);
module.exports=supplier;