var mongoose              = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema ({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose); //allows the user model to use passport methods to authenticate

module.exports = mongoose.model("User", userSchema);