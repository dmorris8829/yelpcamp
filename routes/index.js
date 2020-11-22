var express = require("express"),
	router 	= express.Router();

var passport = require("passport");

var Campground = require("../models/campground");
var	Comment   = require("../models/comment");
var User	 = require("../models/user");
var	middleware = require("../middleware");


// Landing Page Route

router.get("/", function(req, res){
	res.render("landing");
});



// Sign-up

router.get("/register", function(req, res){
	res.render("register");
	
});

//Sign-up functionality

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("succes", "Welcome to YelpCamp " + user.username);
			res.redirect("campgrounds");
		});
	});
	
});

// Show login

router.get("/login", function(req, res){
	res.render("login")
});

// Login functionality

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}) , function(req,res){


});


//Logout

router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "You logged out successfully!");
	res.redirect("/");
});

module.exports = router;