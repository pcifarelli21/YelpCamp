const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");



// Root Route
router.get('/', (req, res) => {
    res.render("landing.ejs")
});

//Show register form 
router.get("/register", function(req, res){
    res.render("register");
})

// HANDLE SIGNUP LOGIC
router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", failureRedirect: "/login"
    }), 
    function(req, res){
});

//Logout Route
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

//Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;