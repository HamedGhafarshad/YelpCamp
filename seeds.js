var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
	{
		name: "Cloud's Rest", 
		image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet elit sem. Duis semper, lectus sit amet lobortis interdum, tellus dui bibendum leo, in placerat nisl sem sed nibh. Maecenas aliquet placerat sapien. Aliquam velit enim, egestas ut odio non, posuere tristique est. Nullam egestas elit magna, non posuere orci commodo ut. In hac habitasse platea dictumst. Nullam vitae convallis augue, eget rhoncus massa. Nullam a dui ex. Donec suscipit, sapien in eleifend vehicula, velit sapien venenatis purus, accumsan fringilla elit ipsum sed magna. Sed id ullamcorper est. Nunc velit metus, ullamcorper quis libero a, faucibus malesuada nisl. Sed risus massa, sodales vel iaculis ac, mollis nec lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. "
	},
	{
		name: "Cloud's Mesa", 
		image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet elit sem. Duis semper, lectus sit amet lobortis interdum, tellus dui bibendum leo, in placerat nisl sem sed nibh. Maecenas aliquet placerat sapien. Aliquam velit enim, egestas ut odio non, posuere tristique est. Nullam egestas elit magna, non posuere orci commodo ut. In hac habitasse platea dictumst. Nullam vitae convallis augue, eget rhoncus massa. Nullam a dui ex. Donec suscipit, sapien in eleifend vehicula, velit sapien venenatis purus, accumsan fringilla elit ipsum sed magna. Sed id ullamcorper est. Nunc velit metus, ullamcorper quis libero a, faucibus malesuada nisl. Sed risus massa, sodales vel iaculis ac, mollis nec lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. "
	},
	{
		name: "Cloud's Summit", 
		image: "https://farm9.staticflickr.com/8673/15989950903_8185ed97c3.jpg",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet elit sem. Duis semper, lectus sit amet lobortis interdum, tellus dui bibendum leo, in placerat nisl sem sed nibh. Maecenas aliquet placerat sapien. Aliquam velit enim, egestas ut odio non, posuere tristique est. Nullam egestas elit magna, non posuere orci commodo ut. In hac habitasse platea dictumst. Nullam vitae convallis augue, eget rhoncus massa. Nullam a dui ex. Donec suscipit, sapien in eleifend vehicula, velit sapien venenatis purus, accumsan fringilla elit ipsum sed magna. Sed id ullamcorper est. Nunc velit metus, ullamcorper quis libero a, faucibus malesuada nisl. Sed risus massa, sodales vel iaculis ac, mollis nec lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. "
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

