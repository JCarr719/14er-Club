var Peak = require('../models/peak');
var Comment = require('../models/comment');

// ALL MIDDLEWARE GOES HERE
var middlewareObj = {};

middlewareObj.checkPeakOwnership = function(req, res, next){
         if(req.isAuthenticated()){
            Peak.findById(req.params.id, function(err, foundPeak){
               if(err || !foundPeak){
                   console.log(err);
                   req.flash('warning', "Peak not found!");
                   res.redirect('back');
               } else {
                   // does the user own the campground?
                   if(foundPeak.author.id.equals(req.user._id) || req.user.isAdmin){
                       req.peak = foundPeak;
                       next(); 
                   } else {
                       req.flash('error', "You don't have permission to do that!");
                       res.redirect('/peaks/' + req.params.id);
                   }
               }
            });
        } else {
            req.flash('error', 'You need to be logged in to do that');
            res.redirect('/peaks/' + req.params.id);
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
               if(err || !foundComment){
                   console.log(err);
                   req.flash('error', 'Sorry, that comment doesn\'t exist!');
                   res.redirect('back');
               } else {
                   // does the user own the comment?
                   if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                       req.comment = foundComment;
                       next(); 
                   } else {
                        req.flash('error', "You don't have permission to do that!");
                        res.redirect('peaks/' + req.params.id);
                   }
               }
             });
         } else {
            req.flash('error', 'You need to be logged in to do that');
            res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
 if(req.isAuthenticated()){
        return next();
    } 
    req.flash('error', "You must be logged in to do that!");
    res.redirect('/login');
};

module.exports = middlewareObj;