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
router.get('/new', (req, res) => {
    res.render("campgrounds/new")
})

// CREATE - add new campground to DB
router.post('/', function(req, res){
    //get data from form and add to campground array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let newCampground = {name: name, image:image, description: desc}
    // Create a new campground and save to DB
    campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err)
        } else {
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

module.exports = router;