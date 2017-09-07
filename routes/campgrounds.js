var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")



//isLoggedIn middleware, will later go into its own file
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }   
}

//checkCampgroundOwnership middleware is to check if a user is logged in before editing/deleting and/or displaying edit/delete buttons
function checkCampgroundOwnership(req, res, next){
        if(req.isAuthenticated()){
        //does user own the campground?
            Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }else{
                // does the user own the camground ?
                
                if(foundCampground.author.id.equals(req.user._id)){
                    next(); 
                }else{
                    res.redirect("back");
                }
            }
            
            });
        }else{
        res.redirect("back");
    }
}

//Routes to the campgrounds page
router.get("/", function(req, res){
//    res.render("campgrounds", {campgrounds:campgrounds});
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds, currentUser: req.user});
        }
    });
});

//New route
router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new", {currentUser: req.user});

});

//Show route
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            //render show tempalte with that campground
            res.render("campgrounds/show", {campground: foundCampground, currentUser: req.user});
	}
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
 
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});  
    });
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id", checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect somewhere(show page)
});

//DESTROY ROUTE
router.delete("/:id",checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

//Create route
router.post("/", isLoggedIn, function(req, res){
//    res.send("You hit the POST");

    // get data from form and add to campgrounds array
    // redirect back to campgrounds route
    var image = req.body.image;
    var name = req.body.name;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description : desc, author: author};
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



//All routes were added to router so now we export the router
module.exports = router;