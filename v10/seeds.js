var mongoose    = require('mongoose');
var Peak            = require('./models/peak');
var Comment         = require('./models/comment');

var data = [
    {
        name: 'Pikes Peak',
        image: 'https://www.14ers.com/photos/pikespeak/200105_Pikes04a.jpg?lu=20180101',
        description: 'Tallest 14er in Colorado, 13.1 mile trail to the top. The summit is a source of power. The long view gives one knowledge and time to prepare. The summit, by virtue of the dizzying exposure, leaves one vulnerable. A bit of confidence and a dash of humility is all we get for our work. Yet to share these moments with friends is to be human. C. Anker'
    },{
        name: 'Mount Cameron',
        image: 'http://88keys.net/garyblog/wp-content/uploads/garyblog/2008/08/p1010646.JPG',
        description: 'A beautiful hike, located near three other easiliy accesible peaks. The summit is a source of power. The long view gives one knowledge and time to prepare. The summit, by virtue of the dizzying exposure, leaves one vulnerable. A bit of confidence and a dash of humility is all we get for our work. Yet to share these moments with friends is to be human. C. Anker'
    },{
        name: 'Maroon Bells',
        image: 'https://fastestknowntime.com/sites/default/files/styles/very_large/public/2018-01/MaroonBells.JPG?itok=MGpCGmM0',
        description: 'Some of the most iconic peaks in the state, and often considered the most beautiful. The summit is a source of power. The long view gives one knowledge and time to prepare. The summit, by virtue of the dizzying exposure, leaves one vulnerable. A bit of confidence and a dash of humility is all we get for our work. Yet to share these moments with friends is to be human. C. Anker'
    }
    ];

// remove all peaks
    function seedDB(){
        Peak.remove({}, function(err){
            if(err){
                console.log(err);
            } 
                console.log('removed peaks');


 // add a few peaks
data.forEach(function(seed){
Peak.create(seed, function(err, peak){
    if(err){
        console.log(err);
    } else {
        console.log('added a peak!');
// add some comments
        Comment.create({
            text: 'Gorgeous, but potentially very dangerous.',
            author: 'Albert Pike'
        }, function(err, comment){
            if(err){
                console.log(err);
            } else {
                peak.comments.push(comment);
                peak.save();
                console.log('created new comment');
            }
        });
    }
});
});
            
}); 
// add a few comments    
}


module.exports =  seedDB;