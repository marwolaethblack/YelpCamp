var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//===============================
//CAMPGROUND ROUTES
//===============================


router.get("/", function(req, res) {
    res.render("landing");
});


//INDEX route - shows all campgrounds
router.get("/campgrounds", function (req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if(err) {
            console.log(err);
        } else {
           res.render("campgrounds/index", {campgrounds : allCampgrounds}); 
        }
    });
    
});

//CREATE route - adds new campground to the databse
router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
   //get data from form and add to campgrounds array 
   var name = req.body.name;
   var image = req.body.image;
   var description = req.body.description;
   var price = req.body.price;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newCampground = {name:name, price: price, image:image, description:description, author: author};

   
   Campground.create(newCampground, function(err, campground) {
       if(err) {
           console.log(err);
       } else {
           //redirect back to campgrounds page
           res.redirect("/campgrounds");
       }
   });
   
});

//NEW route - shows form to create a campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//SHOW route - shows more information about a specific campground
router.get("/campgrounds/:id", function(req, res) {
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if(err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground}); 
        }
    });
   
});

//EDIT campground route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground});

    });
    
});

//UPDATE campground route
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY campground route
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(err) {
      if(err) {
          res.redirect("/campgrounds")
      } else {
          res.redirect("/campgrounds")
      }
   }); 
});

//SEARCH ajax route
router.get("/campgrounds/search/:query", function(req, res) {
   Campground.find({
      "name": { "$regex": req.params.query, "$options": "i" }  //searches the database for campgrounds whose names contain the string in the GETter :query
   }).lean().exec(function(err, foundDocs) {
       if(err) {
           return res.send("No matches.");
       } 
           return res.send(foundDocs);
   });
   
});



module.exports = router;
