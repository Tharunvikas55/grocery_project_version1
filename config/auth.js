module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated() ) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/index');      
    },
    isAdmin: function(req, res, next) {  
      if (req.user.isAdmin == true) {
         return next(); 
      }
      else{
        res.redirect("/login");
      }
      res.render("404")
    },
  };
  