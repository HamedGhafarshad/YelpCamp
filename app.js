var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");

//requireing routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

//seedDB(); //seed the database


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

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// Passport Configuration
app.use(require("express-session")({
   secret: "Once again Rusty wins cutest dog",
   resave: false,
   saveUninitialized: false
}));

app.use(function(req, res, next){ //Every rout will have res.locals.currentUser available
   res.locals.currentUser = req.user;
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//Server is ran on port 8888
app.listen(process.env.PORT || 8888, function(){
    console.log("YelpCamp Server Has Started!");
});


