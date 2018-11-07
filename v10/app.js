var express        = require('express'),
    app            = express(),    
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local'),
    methodOverride = require('method-override'),
    Peak           = require('./models/peak'),
    Comment        = require('./models/comment'),
    User           = require('./models/user'),
    seedDB         = require('./seeds');
  
//requiring routes  
    var commentRoutes = require('./routes/comments'),
        peakRoutes    = require('./routes/peaks'),
        indexRoutes   = require('./routes/index');
    
mongoose.connect('mongodb://localhost:27017/colorado14_v9', { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
// seedDB(); //seed the database

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

app.use(indexRoutes);
app.use('/peaks', peakRoutes);
app.use('/peaks/:id/comments', commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Peaks server on!');
});





