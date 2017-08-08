var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
seedDB();


var uristring = "mongodb://hghafars:trunks123@ds163612.mlab.com:63612/yelp_camp"

//Connecting to our database, will create db if none exist

//mongoose.connect("mongodb://localhost/yelp_camp");


mongoose.connect(uristring, function(err, res){
    if(err){
        console.log("error");
    }else{
        console.log("Success");
    }
});


// Passport Configuration
app.use(require("express-session")({
   secret: "Once again Rusty wins cutest dog",
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Setting up bodyParser
app.use(bodyParser.urlencoded({extended: true}));

//Don't use EJS suffix when calling res.render()
app.set("view engine", "ejs");

//Connecting to stylesheet
app.use(express.static(__dirname + "/public"));
console.log(__dirname);

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
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});

//New route
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");

});

//Show route
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
	    console.log(foundCampground);
            //render show tempalte with that campground
            res.render("campgrounds/show", {campground: foundCampground});
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

// ========================
// COMMENTS ROUTES
// ========================

app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", function(req, res){
	//lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");		
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
	//create new comment
	//connect new comment to campground
	//redirect back to show page
});

// =========
//AUTH ROUTES
// =========

//show register form
app.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }else{
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds"); 
        });
        }
    });   
 //   res.send("Signing you up..."); 
});

// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});
//handling login logic
//app.post("/login", middleware, callback(unused))
app.post("/login", passport.authenticate("local", 
    {
    
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"

    }), function(req, res){
});

//Server is ran on port 8888
app.listen(process.env.PORT || 8888, function(){
    console.log("YelpCamp Server Has Started!");
});


