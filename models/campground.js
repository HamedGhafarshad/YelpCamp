var mongoose = require("mongoose");
// Schema Setup(should be broken into seperate files later)
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    author:{
        id:{
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
//Compiles a model from the schema 
var Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;
