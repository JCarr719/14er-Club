var express     = require('express'),
    app         = express(),    
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');
    
mongoose.connect('mongodb://localhost:27017/colorado14', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// SCHEMA SETUP

var peakSchema = new mongoose.Schema({
    name: String,
    image: String, 
    description: String
});

var Peak = mongoose.model('Peak', peakSchema);

// Peak.create(        
//             {name: 'Mount Democrat', 
//             image: 'https://www.reserveamerica.com/webphotos/NRSO/pid70044/0/540x360.jpg',
//             description: "One of the collegiate peaks, leading to the three others. Beautiful views and nearby aspens."   

//           }, function(err, peak){
//         if(err){
//             console.log(err);
//         } else {
//             console.log('NEW PEAK ADDED');
//             console.log(peak);
//         }
//     });


        // {name: "Grey's & Torrey's Peak", image: 'http://www.thinair4x4.com/trips/peru_creek_july09/2009-07-25%20Peru%20Creek%20&%20Saxon%20Mountain%20_1CA1335.jpg'}
        // ];

app.get('/', function(req, res){
    res.render('landing');
})

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

app.get('/peaks/:id', function(req, res){
    // find peak with provided id
    Peak.findById(req.params.id, function(err, foundpeak){
        if(err){
            console.log(err);
        } else {
                // render show template with that peak
                 res.render('show', {peak: foundpeak});
        }
    })
    req.params.id

});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Peaks server on!');
});





