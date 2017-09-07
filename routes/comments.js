var express = require("express");
var router = express.Router({mergeParams: true}); //mergeParams: true allows us to access Ids from campground
var Campground = require("../models/campground");
var Comment = require("../models/comment");


//isLoggedIn middleware, will later go into its own file
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }   
}

//checkCommentOwnrship middleware is to check if a user is logged in before editing/deleting campground comments and/or displaying 
// edit & delete buttons in show page 
function checkCommentOwnership(req, res, next){
    //is the User logged in?
        if(req.isAuthenticated()){
        //does user own the campground?
            Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                // does the user own the comment
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

// ========================
// COMMENTS ROUTES
// ========================

//Comments New
router.get("/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground, currentUser: req.user});
		}
	});
});

//Comments Create
router.post("/", isLoggedIn, function(req, res){
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
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //push comment
					campground.comments.push(comment);
					campground.save();
                    console.log(comment);
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
	//create new comment
	//connect new comment to campground
	//redirect back to show page
});

//Comments Edit Route
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else{
          res.render("comments/edit", {campground_id: req.params.id, comment: foundComment });

      }
   });
});

//Comments Update Route
//Needs middleware to protect it from being updated from POSTMAN or other third-party app
router.put("/:comment_id", checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

//Comments destroy route
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
   //findByIDAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id)
       }
    });
});
module.exports = router;