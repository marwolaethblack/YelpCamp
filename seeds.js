var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
       name: "Cloud's Rest",
       image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
       description: "Lorem ipsum dolor sit amet, ne nam justo regione legendos, ut enim deleniti platonem vis. Duo in percipit iracundia sententiae. Ei graecis erroribus nam, usu te fuisset propriae. Usu odio nostro gloriatur ne, eu soluta essent sit. Ei nam natum choro perfecto, at per viris euismod accusata. Offendit facilisis liberavisse has cu, graece audiam delectus ius et."
    },
    {
       name: "Canyon Floor",
       image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
       description: "Lorem ipsum dolor sit amet, ne nam justo regione legendos, ut enim deleniti platonem vis. Duo in percipit iracundia sententiae. Ei graecis erroribus nam, usu te fuisset propriae. Usu odio nostro gloriatur ne, eu soluta essent sit. Ei nam natum choro perfecto, at per viris euismod accusata. Offendit facilisis liberavisse has cu, graece audiam delectus ius et."
    },
    {
       name: "Rocky Hill",
       image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
       description: "Lorem ipsum dolor sit amet, ne nam justo regione legendos, ut enim deleniti platonem vis. Duo in percipit iracundia sententiae. Ei graecis erroribus nam, usu te fuisset propriae. Usu odio nostro gloriatur ne, eu soluta essent sit. Ei nam natum choro perfecto, at per viris euismod accusata. Offendit facilisis liberavisse has cu, graece audiam delectus ius et."
    }
];

function seedDB() {
    //remove all campgrounds
    Campground.remove({}, function(err) {
       if(err) {
           console.log(err);
       } 
       console.log("removed campgrounds");
       Comment.remove({});
        //create campgrounds
        data.forEach(function(seed) {
            Campground.create(seed, function(err, campground) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Added a campground");
                    Comment.create({
                        text: "Great Place asdaassdsa",
                        author: "Jon"
                    }, function (err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(comment);
                            campground.comments.push(comment);
                            campground.save();
                        }
                    });
                }
            })
        });
    });
   
    
};

module.exports = seedDB;