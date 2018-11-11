var express = require('express');
var router = express.Router({mergeParams: true});
var Peak = require('../models/peak');
var Comment = require('../models/comment');
var middleware = require('../middleware/');


// Comments New
router.get('/new', middleware.isLoggedIn, function(req, res){
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
router.post('/', middleware.isLoggedIn, function(req, res){
    //lookup peak with id
    Peak.findById(req.params.id, function(err, peak){
        if(err){
            console.log(err);
            res.redirect('/peaks');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash('error', 'Something went wrong!');
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    peak.comments.push(comment);
                    peak.save();
                    req.flash('success', 'Successfully added comment!');
                    res.redirect('/peaks/' + peak._id);
                }
            });
        }
    });

    
    
    
});

// COMMENT EDIT
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect('back');
        } else {
             res.render('comments/edit', {peak_id: req.params.id, comment: req.comment});
        }
    });
});

// COMMENT UPDATE
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/peaks/' + req.params.id);
        }
    });
});

// COMMENTS DESTROY ROUTE
router.delete('/:comment_id' ,middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back');
        } else {
            req.flash('success', 'Comment deleted!');
            res.redirect('/peaks/' + req.params.id);
        }
    });
});


module.exports = router;