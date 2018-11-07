var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

var campgrounds = [
        {name: 'Blanca Peak', image: 'https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1504579698/campground-photos/eozhlykyv56l60g0eekk.jpg'},
        {name: 'Mount Democrat', image: 'https://www.reserveamerica.com/webphotos/NRSO/pid70044/0/540x360.jpg'},
        {name: "Grey's & Torrey's Peak", image: 'http://www.thinair4x4.com/trips/peru_creek_july09/2009-07-25%20Peru%20Creek%20&%20Saxon%20Mountain%20_1CA1335.jpg'}
        ];

app.get('/', function(req, res){
    res.render('landing');
})

app.get('/campgrounds', function(req, res){
    
res.render('campgrounds', {campgrounds: campgrounds});
});

app.get('/campgrounds/new', function(req, res){
    res.render('new.ejs');
});

app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newSite = {name: name, image: image};
    campgrounds.push(newSite);
    // redirect back to campgrounds page
    res.redirect('/campgrounds');
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('YelpCamp server on!');
});