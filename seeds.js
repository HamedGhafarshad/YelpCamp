var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
	{
		name: "Cloud's Rest", 
		image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
		description: "blah blah blah"
	},
	{
		name: "Cloud's Mesa", 
		image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg",
		description: "blah blah blah"
	},
	{
		name: "Cloud's Summit", 
		image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
		description: "blah blah blah"
	}
]

function seedDB(){
	//Remove all campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("removed campgrounds!");
			//Add a few campgrounds
			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(err){
						console.log(err);			
					}else{
						console.log("added a campground");
						Comment.create(
							{
								text:"This place is great but I wish there was internet",
								author:"Jamal"
							}, function(err, comment){
								if(err){
									console.log(err);
								}else{
									campground.comments.push(comment);
									campground.save();
									console.log("Created new comment");
								}
							});
					}
				});
			});
		}
	});

	//Add a few comments;
}
module.exports = seedDB;

