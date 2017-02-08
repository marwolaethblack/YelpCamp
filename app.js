//==========================================
//******************************************
//DEPENDENCIES
//******************************************
//==========================================
var express        = require("express"), 
    app            = express(),
    bodyParser     = require("body-parser"), //for parsing data out of req.body in a post request
    methodOverride = require("method-override"),
    flash          = require("connect-flash"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds"); //clears and populates the database
    //seedDB();
    
mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine", "ejs"); //Removes the need to put .ejs at the end of ejs files
app.use(express.static(__dirname + "/public")); //serves css files

app.use(bodyParser.urlencoded({extended : true})); //parses data out of form bodys
app.use(methodOverride("_method")); //simulates PUT and DELETE requests
app.use(flash()); //flash messages

//PASSPORT CONFIGURATIONS
app.use(require("express-session")({
    secret: "Secret phrase for authentication",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {  
    res.locals.currentUser = req.user; //passes currentUser to all routes
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})



//==========================================
//******************************************
//ROUTES
//******************************************
//==========================================
var indexRoutes = require("./routes/index");
var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

//==========================================
//******************************************
//SERVER START
//******************************************
//==========================================
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started");
});