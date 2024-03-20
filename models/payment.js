const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: String,
  payerId: String,
  paymentDetails: Object
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;