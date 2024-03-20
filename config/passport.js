const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const Customer = require('../models/Customer');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'customerMobileNumber' }, (customerMobileNumber, password, done) => {
      // Match user
      Customer.findOne({
        customerMobileNumber: customerMobileNumber
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That customer is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Customer.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
