var express = require('express');
var router = express.Router({mergeParams: true});
var Peak = require('../models/peak');
var Comment = require('../models/comment');

// Comments New
router.get('/new', isLoggedIn, function(req, res){
    // find campground by id
    Peak.findById(req.params.id, function(err, peak){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {peak: peak});
        }
    });
});

// Comments Create
router.post('/', isLoggedIn, function(req, res){
    //lookup peak with id
    Peak.findById(req.params.id, function(err, peak){
        if(err){
            console.log(err);
            res.redirect('/peaks');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    peak.comments.push(comment);
                    peak.save();
                    res.redirect('/peaks/' + peak._id);
                }
            });
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