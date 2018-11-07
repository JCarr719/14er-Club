var express     = require('express'),
    app         = express(),    
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose'),
    Peak        = require('./models/peak'),
    seedDB      = require('./seeds');
    
// 
mongoose.connect('mongodb://localhost:27017/colorado14_v3'), { useNewUrlParser: true };
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
seedDB();

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/peaks', function(req, res){
    // res.render('peaks', {peaks: peaks});
    // get all peaks from db
    Peak.find({}, function(err, mongopeaks){
        if(err){
            console.log(err);
        } else {
            res.render('index', {peaks: mongopeaks});
        }
    });
});

app.get('/peaks/new', function(req, res){
    res.render('new.ejs');
});

app.post('/peaks', function(req, res){
    var name    = req.body.name;
    var image   = req.body.image;
    var desc    = req.body.description;
    var newSite = {name: name, image: image, description: desc};
    // create a new peak and save to the db
    Peak.create(newSite, function(err, newPeak){
        if(err){
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect('/peaks');
        }
    });
});

// SHOW - shows more info abvout one peak
app.get('/peaks/:id', function(req, res){
    // find peak with provided id
    Peak.findById(req.params.id).populate('comments').exec(function(err, foundpeak){
        if(err){
            console.log(err);
        } else {
            console.log(foundpeak);
                // render show template with that peak
                 res.render('show', {peak: foundpeak});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Peaks server on!');
});





