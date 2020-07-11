const mongoose = require("mongoose");

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: { type: Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
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

