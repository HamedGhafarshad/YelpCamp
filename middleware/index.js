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
                    req.flash("error", "Campground not found!");
                    res.redirect("back");
                }else{
                    // does the user own the camground ?
                    
                    if(!foundCampground){
                        req.flash("error", "Item not found!");
                        return res.redirect("back");
                        
                    }
                    
                    if(foundCampground.author.id.equals(req.user._id)){
                        next(); 
                    }else{
                        req.flash("error", "You don't have permission to do that!");
                        res.redirect("back");
                    }
                }

                });
            }else{
                req.flash("error", "You need to be logged in to do that!");
                res.redirect("back");
        }
    }


middlewareObj.checkCommentOwnership = 
    function (req, res, next){
            if(req.isAuthenticated()){
            //does user own the campground?
                Comment.findById(req.params.comment_id, function(err, foundComment){
                if(err){
                    req.flash("error", "Something went wrong!")
                    res.redirect("back");
                }else{
                    // does the user own the camground ?

                    if(foundComment.author.id.equals(req.user._id)){
                        next(); 
                    }else{
                        req.flash("error", "You do not have permission to do that!");
                        res.redirect("back");
                    }
                }
                });
            }else{
                req.flash("error", "You need to be logged in to do that!");
                res.redirect("back");
        }
    }

//isLoggedIn middleware, will later go into its own file
middlewareObj.isLoggedIn = 
    function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            req.flash("error", "Please Login First!");
            res.redirect("/login");
        }   
    }


module.exports = middlewareObj //middlewareObj will contain all of the methods