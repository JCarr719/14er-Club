var express = require('express');
var router = express.Router();
var Peak = require('../models/peak');

// INDEX- show all peaks
router.get('/', function(req, res){
    // res.render('peaks', {peaks: peaks});
    // get all peaks from db
    Peak.find({}, function(err, mongopeaks){
        if(err){
            console.log(err);
        } else {
            res.render('peaks/index', {peaks: mongopeaks});
        }
    });
});

// CREATE - add new peak to DB
router.post('/', isLoggedIn, function(req, res){
    var name    = req.body.name;
    var image   = req.body.image;
    var desc    = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newSite = {name: name, image: image, description: desc, author: author};
    // create a new peak and save to the db
    Peak.create(newSite, function(err, newPeak){
        if(err){
            console.log(err);
        } else {
            // redirect back to campgrounds page
            console.log(newPeak);
            res.redirect('/peaks');
        }
    });
});

// NEW - show form to create new peak
router.get('/new', isLoggedIn, function(req, res){
    res.render('peaks/new');
});

// SHOW - shows more info abvout one peak
router.get("/:id", function(req, res){
    // find peak with provided id
    Peak.findById(req.params.id).populate("comments").exec(function(err, foundpeak){
        if(err){
            console.log(err);
        } else {
            console.log(foundpeak);
                // render show template with that peak
                 res.render("peaks/show", {peak: foundpeak});
        }
    });
});

// middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect('/login');
}

module.exports = router;
