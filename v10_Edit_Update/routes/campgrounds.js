const express = require('express');
const router = express.Router();
const campground = require("../models/campground");

// INDEX  - SHow all Campgrounds
router.get("/", (req, res) => {
    // Get all campgrounds from DB
    campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    })
});

// NEW - show form to create new campground
router.get('/new', isLoggedIn, (req, res,) => {
    res.render("campgrounds/new")
})

// CREATE - add new campground to DB
router.post('/', isLoggedIn, function(req, res){
    //get data from form and add to campground array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, image:image, description: desc, author: author}
    // Create a new campground and save to DB
    campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
            console.log(newlyCreated);
         //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

// SHOW - shows more info about one campground
router.get('/:id', function(req, res) {
    //find the campground with provided ID
    campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', function(req, res){
    campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            res.redirect("/campgrounds")
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
})

// UPDATE CAMPGROUND ROUTE
router.put('/:id', function(req, res){
    //find and update the correct campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
                // redirect somewhere(show page)
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DESTROY CAMPGROUND ROUTE
router.delete('/:id', function(req, res){
    campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//Middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;