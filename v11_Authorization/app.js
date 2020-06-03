const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const methodOverride = require('method-override');

// Requiring Route files
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");


const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/yelp_camp_v11", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB();  // seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Spencer is awesome!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})


// Express Router - Tells app to use route files that we required
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, (req, res) => {
    console.log(`Server started on port: ${port}`)
});

