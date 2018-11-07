var Peak = require('../models/peak');
var Comment = require('../models/comment');

// ALL MIDDLEWARE GOES HERE
var middlewareObj = {};

middlewareObj.checkPeakOwnership = function(req, res, next){
         if(req.isAuthenticated()){
            Peak.findById(req.params.id, function(err, foundPeak){
               if(err){
                   res.redirect('back');
               } else {
                   // does the user own the campground?
                   if(foundPeak.author.id.equals(req.user._id)){
                       next(); 
                   } else {
                       res.redirect('back');
                   }
               }
            });
        } else {
            res.redirect('back');
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
               if(err){
                   res.redirect('back');
               } else {
                   // does the user own the comment?
                   if(foundComment.author.id.equals(req.user._id)){
                       next(); 
                   } else {
                       res.redirect('back');
                   }
               }
             });
         } else {
             res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
 if(req.isAuthenticated()){
        return next();
    } 
    res.redirect('/login');
};

module.exports = middlewareObj;