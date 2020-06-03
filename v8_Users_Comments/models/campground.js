const mongoose = require("mongoose");

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


// const campground = mongoose.model("Campground", campgroundSchema);
// module.exports = campground;

//TODO: another way to represent the export, replace both lines above with below code
module.exports = mongoose.model("Campground", campgroundSchema);

