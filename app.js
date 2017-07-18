var express = require("express"),
              app = express()
              bodyParser = require("body-parser");
              mongoose = require("mongoose");

//var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/yelp_camp';

//var uristring = "mongodb://heroku_nlrbc8sq:re5qmvtb4biesrgdgn3codkfpp@ds163612.mlab.com:63612/heroku_nlrbc8sq";

var uristring = "mongodb://hghafars:trunks123@ds163612.mlab.com:63612/yelp_camp"

var theport = process.env.PORT || 8888;

/*
var campgrounds = [
        {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3751/9580653400_e1509d6696.jpg"},
        {name: "Granite Hill", image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"}, 
        {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3751/9580653400_e1509d6696.jpg"},
        {name: "Granite Hill", image: "https://farm9.staticflickr.com/8167/7121865553_e1c6a31f07.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"}
    ]
*/

//mongoose.Promise = global.Promise

//Connecting to our database, will create db if none exist

//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect(uristring, function(err, res){
    if(err){
        console.log("error");
    }else{
        console.log("Success");
    }
});


//Setting up bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//Don't use EJS suffix when calling res.render()
app.set("view engine", "ejs");

// Schema Setup(should be broken into seperate files later)
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
//Compiles a model from the schema 
var Campground = mongoose.model("Campground", campgroundSchema);
/*
Campground.create(
        { 
         name: "Mountain Goat's Rest", image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg", description: "This is a famous campground associated with a mountain goat myth. Bathrooms and clean water available."
            
         
        }, function(err, campground){
        if(err){
            console.log(err);
        }else{
            console.log("NEWLY CREATED CAMPGROUND:");
            console.log(campground);
        }
    });
*/
//Routes to home page
app.get("/", function(req, res){
    res.render("landing");

});

//Routes to the campgrounds page
app.get("/campgrounds", function(req, res){
//    res.render("campgrounds", {campgrounds:campgrounds});
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index", {campgrounds:allCampgrounds});
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");

});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            //render show tempalte with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});

//Activated when user completes new campground form
app.post("/campgrounds", function(req, res){
//    res.send("You hit the POST");

    // get data from form and add to campgrounds array
    // redirect back to campgrounds route
    var image = req.body.image;
    var name = req.body.name;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description : desc};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newCreated);
            res.redirect("/campgrounds");
        }
    });
    //campgrounds.push(newCampground);
    // redirect back to campgrounds page
});

//Server is ran on port 8888
app.listen(process.env.PORT || 8888, function(){
    console.log("YelpCamp Server Has Started!");
});


