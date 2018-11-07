var express       = require('express'),
    app           = express(),    
    bodyParser    = require('body-parser'),
    mongoose      = require('mongoose'),
    passport      = require('passport'),
    LocalStrategy = require('passport-local'),
    Peak          = require('./models/peak'),
    Comment       = require('./models/comment'),
    User          = require('./models/user'),
    seedDB        = require('./seeds');

mongoose.connect('mongodb://localhost:27017/colorado14_v6', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
seedDB();

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'devSecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

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
            res.render('peaks/index', {peaks: mongopeaks});
        }
    });
});

app.get('/peaks/new', function(req, res){
    res.render('peaks/new');
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
app.get("/peaks/:id", function(req, res){
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




// ============================================================================
// COMMENTS ROUTES
// ============================================================================

app.get('/peaks/:id/comments/new', isLoggedIn, function(req, res){
    // find campground by id
    Peak.findById(req.params.id, function(err, peak){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {peak: peak});
        }
    })
});

app.post('/peaks/:id/comments', isLoggedIn, function(req, res){
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
    // create new comment
    // connect new comment to peak
    // redirect to peaks show page
});



// =============
// AUTH ROUTES
// =============

// show register form
app.get('/register', function(req, res){
    res.render('register');
});
// handle sign up logic
app.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.error(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/peaks');
        });
    });
});

// show login form
app.get('/login', function(req, res){
    res.render('login');
});
// handling login logic
app.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/peaks',
        failureRedirect: '/login'
    }), function(req, res){
});


// LOGOUT ROUTE
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/peaks');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect('/login');
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Peaks server on!');
});





