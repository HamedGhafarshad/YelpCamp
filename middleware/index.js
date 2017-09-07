var Campground = require("../models/campground");
var Comment = require("../models/comment");


// all the middleware goes here
var middlewareObj = {};

//checkCampgroundOwnership middleware is to check if a user is logged in before editing/deleting and/or displaying edit/delete buttons
middlewareObj.checkCampgroundOwnership =   
    function (req, res, next){
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


middlewareObj.checkCommentOwnership = 
    function (req, res, next){
            if(req.isAuthenticated()){
            //does user own the campground?
                Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    res.redirect("back");
                }else{
                    // does the user own the camground ?

                    if(foundComment.author.id.equals(req.user._id)){
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

//isLoggedIn middleware, will later go into its own file
middlewareObj.isLoggedIn = 
    function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            res.redirect("/login");
        }   
    }


module.exports = middlewareObj //middlewareObj will contain all of the methods