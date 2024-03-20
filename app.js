const express=require("express");
const mongoose=require('mongoose');
const session=require("express-session");
const MongoDBStore=require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const passport=require("passport");
const fileUpload=require("express-fileupload")
const url=require("url")
const paypal=require('paypal-rest-sdk');
// const hbs=require("express-handlebars");
// const localStrategy=require("passport-local").Strategy;
// const bcrypt=require("bcrypt");

const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');
const path = require('path');
const app=express();
/////////////////
//stripe payment
var Publishable_Key = 'pk_test_51N3AfpSFD1MrxiZdNvzQ4NTGoWBb9oXivvlsD8oJFrDtiFrT3c1SP2kJ5hkDzrTBJ7ycp8JElD2mNn7IQfRXDV3q004DYrprxB'
var Secret_Key = 'sk_test_51N3AfpSFD1MrxiZdB97JKNObLYrZQf2MZC47xpWqt2ZEmTp3PFB5ubAIXaiZwnOdnSMJEXtdtULsBEbwcaLFbYJJ003Si35klt'
 
const stripe = require('stripe')(Secret_Key)
app.get('/payment',(req,res)=>{
  res.render('payment', {
    key: Publishable_Key
 });
})
////////////
// Passport Config
require('./config/passport')(passport);

//DB configuration
const db=require("./config/keys").MongoURI;

const adminRoutes=require('./routes/adminRoutes');
const customerRoutes=require("./routes/customerRoutes");
const authRoutes=require("./routes/authRoutes");
const adminCatogories=require("./routes/adminCatogories");
const cart=require("./routes/cart");
const Cart=require("./models/Cart");
const Product=require("./models/Stock");
var Customer=require("./models/Customer")
var Catagory=require("./models/AdminCatogories")
const Order=require("./models/Order");


const Store=new MongoDBStore({
  uri:db,
  collection:'sessions'
});


mongoose.connect(db, {
   useNewUrlParser: true,
   useUnifiedTopology: true
});
mongoose.set('strictQuery', true);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

Catagory.find(function(err,catogories){
  if(err){
    console.log(err);
  } else {
    app.locals.catogories=catogories;
  }
  
});
Customer.find(function(err,customer){
  if(err){
    console.log(err);
  } else {
    app.locals.customer=customer;
  }
  
});

Product.find(function(err,product){
  if(err){
    console.log(err);
  } else {
    app.locals.product=product;
  }
  
});
Cart.find(function(err,product){
  if(err){
    console.log(err);
  } else {
    app.locals.cart=cart;
  }
  
});

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(fileUpload());
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.get('*',function(req,res,next){
  res.locals.totalamount=req.session.totalamount;
  next();
}
)


app.get('/',forwardAuthenticated,(req,res)=>{

  Product.find()
  .then(result=>{
    res.render("index1",{products :result,title:"index"});
  })
  .catch(err=>{
    console.log(err);
  });
});

const { isAdmin } = require("./config/auth")

app.use('/admin',isAdmin,adminRoutes);
app.use('/admin',isAdmin,adminCatogories);
app.use("/admin/catogories",isAdmin,adminCatogories);
app.use("/customer",customerRoutes);
app.use('/cart',cart);
app.get("/products/:catogory",(req,res)=>{
  const category = req.params.catogory;
  Product.find({ pcatogory: category }, (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.render('searchproducts',{data:data,title:"products",user:req.user});
    }
  });
})

app.use(customerRoutes);

app.use(authRoutes);


// paypal.configure({
//   'mode':'sandbox',
//   'client_id':'AYQE95aNfkGREoGhTChuCh4iQ_IXNY-emVz8FIW9u7jogJzn-2J51DkpKvVrkN15fkDYO2DEkZMsACCP',
//   'client_secret':'EE8v0WypSykKTtMd56PDe1rUT4I-_7mlgKHpeeYjbt7xyEJngK3ftisJDcqMuI2GICj2HrGNDG5oI0Lj'
// });

// app.post('/pay',(req,res)=>{
//   const create_payment_json={
//     "intent":"sale",
//     "payer":{
//       "payment_method":"paypal"
//     },
//     "redirect_url":{
//       "return_url":'http://localhost:3000/success',
//     "cancel_url":"http://localhost:3000/cancel"
//   },
//   "transactions":[{
//     "items_list":{
//       "items":[{
//         "name":"Termeric",
//         "quantity": 2,
//         "price":"20.00",
//         "currency":"USD"

//       }]
//     },
//     "amount":{
//       "currency":"USD",
//       "total":"25.00"
//     },
//     "description":"Hat "
//   }]
// };

// paypal.payment.create(create_payment_json,function(err,payment){
//   if(err){
//     throw err;
//   }
//   else{
//     for(let i=0;i<payment.links.length;i++){
//       if(payment.links[i].rel==='approval_url'){
//         res.redirect(payment.links[i].href);
//       }
//     }
//   }
// });
// });


// const Payment = require('./models/payment');

// app.get('/success', (req, res) => {
//   const paymentId = req.query.paymentId;
//   const payerId = req.query.PayerID;

//   // Use the PayPal REST API to get the payment details
//   paypal.payment.get(paymentId, (error, payment) => {
//     if (error) {
//       // Handle error
//       console.error(error);
//       res.sendStatus(500);
//       return;
//     }

//     // Create a new instance of the Payment model
//     const paymentDetails = {
//       payment: payment
//     };
//     const newPayment = new Payment({
//       paymentId: paymentId,
//       payerId: payerId,
//       paymentDetails: paymentDetails
//     });

//     // Save the payment details to the database
//     newPayment.save((err) => {
//       if (err) {
//         // Handle error
//         console.error(err);
//         res.sendStatus(500);
//         return;
//       }

//       // Render the payment success page
//       res.render('index', { payment: payment,user:req.user });
//     });
//   });
// });


app.get("/pay", async (req, res) => {
  try {
    
    const cart = await Cart.findOne({ userId: req.user});
    
    const order = new Order({
      cart,
      userId: req.user
    });
    await order.save(); // use await to wait for the order to be saved before redirecting
    await cart.remove(); // remove the cart after the order is saved
    res.redirect('/cart/get');  
  } catch (err) {
    console.error(err);
    res.render("500"); // render a 500 error page if there's an error
  }
});
app.use((req,res)=>{
  res.render("404");
})

app.listen(3000);




