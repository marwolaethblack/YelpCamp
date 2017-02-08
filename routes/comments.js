var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")

//===============================================
//COMMENTS ROUTES
//===============================================
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground}); 
        }
    });
   
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
       if(err) {
           console.log(err);
       } else {
           Comment.create(req.body.comment, function(err, newComment) {
              if(err) {
                  req.flash("error", "Something went wrong.");
                  console.log(err);
              } else {
                  //add username and id to comment
                  newComment.author.id = req.user._id;
                  newComment.author.username = req.user.username;
                  newComment.save();
                  foundCampground.comments.push(newComment);
                  foundCampground.save();
                  req.flash("success", "Comment created !");
                  res.redirect("/campgrounds/" + foundCampground._id);
              }
           });
       }
   });
});

//COMMENT EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {comment: foundComment, campground_id: req.params.id}); 
        }
    });
   
});

//COMMENT UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
     Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
         if(err) {
             res.redirect("/campgrounds")
         } else {
             res.redirect("/campgrounds/" + req.params.id);
         }
     });
});

//COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
       if(err) {
           res.redirect("back");
       } else {
           req.flash("success", "Comment destroyed.");
           res.redirect("back");
       }
   }); 
});



module.exports = router;