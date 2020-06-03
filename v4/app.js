const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const campground = require("./models/campground");
const Comment = require("./models/comment");
const seedDB = require("./seeds");

const port = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/yelp_camp_v3", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

app.get('/', (req, res) => {
    res.render("landing.ejs")
});

//TODO: changes made here vs v1
// INDEX  - SHow all Campgrounds
app.get("/campgrounds", (req, res) => {
    // Get all campgrounds from DB
    campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    })
});

// NEW - show form to create new campground
app.get('/campgrounds/new', (req, res) => {
    res.render("campgrounds/new")
})

// CREATE - add new campground to DB
app.post('/campgrounds', function(req, res){
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
app.get('/campgrounds/:id', function(req, res) {
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

// ======================
// COMMENTS ROUTES
// ======================

app.get("/campgrounds/:id/comments/new", function(req, res) {
    //find campground by Id
    campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
})

app.post("/campgrounds/:id/comments", function(req, res) {
    // lookup campground ID
    campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })
    // create new comment
    // connect new comment to campground
    // redirect campground show page
})

app.listen(port, (req, res) => {
    console.log(`Server started on port: ${port}`)
})

