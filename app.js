var express       = require("express"),
	app           = express(),
	bodyParser    = require("body-parser"),
	mongoose      = require("mongoose"),
	Campground    = require("./models/campground"),
	Comment       = require("./models/comment"),
	seedDB        = require("./seeds"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local"),
	User          = require("./models/user"),
	methodOverride   = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	passportLocalMongoose = require("passport-local-mongoose"),
	flash = require("connect-flash");






var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes      = require("./routes/index");

//seedDB(); Uncomment to clear DB and add dummy campgrounds upon restart.

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});



app.use(require("express-session")({
	secret: "Owen is my boy",
	resave: false,
	saveUninitialized: false		
				}));

app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static( __dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//PassPort

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use( new LocalStrategy(User.authenticate()));

//Checks for current user
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Routes
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});