var express = require("express");
var	router 	= express.Router();

var Campground = require("../models/campground");
var	Comment    = require("../models/comment");
var User	 = require("../models/user");
var	middleware = require("../middleware");

// CAMPGROUND INDEX ROUTE - SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	});
});

// CAMPGROUND CREATE ROUTE - CREATE NEW CAMPGROUND IN DB
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
		};
	var newCampground = { name: name , image: image , description: desc , author: author, price: price };
	
	
	// Create new campground and save to database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
		console.log(err);
			   }else{
				   res.redirect("/campgrounds");
			   }
					  });
	
});

// CAMPGROUND NEW ROUTE - SHOW FORM TO CREATE NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new")
});

router.get("/:id", function(req, res){
	// Find the campground with provided provided
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
	// Display show template with that campground
			res.render("campgrounds/show", {campground: foundCampground, currentUser: req.user});
		};
	});
	
// Campground EDIT ROUTE - EDIT THE campground

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res ){
		Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
		});
});	


//UPDATE ROUTE - UPDATE THE Campground

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//sanitise the body
	req.body.campground.body = req.sanitize(req.body.campground.body);
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.render("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

//DELETE ROUTE - DELETE A Campground

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//Destory the campground
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			req.flash("success", "Campground Deleted");
			res.redirect("/campgrounds")
		}
	})
	
	
});	
});
module.exports = router;
