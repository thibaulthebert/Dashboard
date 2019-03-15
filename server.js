// Get all dependences to create the server.
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');


// Create a mongoose variable to interact with database.
mongoose.Promise = global.Promise;

// Connect to mongogb database.
// Initialize mongoose.
mongoose.connect('mongodb://mongo:27017');
db = mongoose.connection;

// Initialize the routes for user and mongodb.
const routes = require('./routes');
const users = require('./routes/user');

// Initialize express.
app = express();
app.set('views', path.join(__dirname, 'views'));

// Load the layout.handlebars and parse the default HTML template.
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

// Load cookie parser to create cookies and save informations with it.
app.use(cookieParser());

// Add folder "public" and "views" to the application.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use(session({
    secret: 'test',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']'
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));


// Use flash to add flash alert when an error occurs.
// Messages are display in html files.
app.use(flash());
app.use(function(req, res, next) {
    res.locals.sucess_msg = req.flash('sucess_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// All GET request connections with passport.

app.get('/auth/steam', passport.authenticate('steam'));

app.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/profile', successRedirect: '/profile'}));

app.get('/auth/twitch', passport.authenticate('twitchtv'));

app.get('/auth/twitch/callback',
    passport.authenticate('twitchtv', { successRedirect: '/profile', failureRedirect: '/profile'}));


// Add routes to the application
app.use('/', routes);
app.use('/users', users);

// Set the port of the application on localhost:8080
app.set('port', 8080);
app.listen(app.get('port'), function(){
    console.log('server started on port' + app.get('port'))
});

// Make a request to the weather API.
// This widget don't need a suser connection.
app.post("/addClimatWidget", function(req, res) {
    var newWidget = require("./models/widget");
    var widget = newWidget({
        userName: req.user.name,
        description: "Climat widget containing climat about one city",
        widgetName: "climat",
        url: req.body.url
    });
    widget.save(function (err) {
        if (err) {
            console.log("Error save climat widget");
            throw err;
        };
        console.log('Climate widget add!');
    });
});

// Save a new document in widget collection.
// This widget don't need a suser connection.
app.post('/addWeatherWidget', function(req, res) {
    var newWidget = require("./models/widget");
    var widget = new newWidget({
        userName: req.user.name,
        description: "Weather widget containing weather about one city",
        widgetName: "weather",
        url: req.body.url
    });
    widget.save(function (err) {
        if (err) {
            console.log("Error save weather widget");
            throw err;
        };
        console.log('Weather widget add!');
    });
});

// Add a article document in the wiget collection.
app.post("/addArticleWidget", function(req, res) {
    var newWidget = require("./models/widget");

    var widget = new newWidget({
        userName: req.user.name,
        description: "Show a article about a keyword",
        widgetName: "article",
        url: req.body.url
    });
    widget.save(function(err) {
        if (err) {
            console.log("Error save article widget");
            throw err;
        };
        console.log("Article widget add!");
    });
});

// GET request in database to send the twitchName to frotn-end.
// This request don't need a user connection.
app.post("/addCRWidget", function(req, res) {
    var newWidget = require("./models/widget");

    var widget = new newWidget({
        userName: req.user.name,
        description: "Show details of player profile",
        widgetName: "clashRoyale",
        url: req.body.url
    });
    widget.save(function (err) {
        if (err) {
            console.log("Error save CR widget");
            throw err;
        };
        console.log('CR widget add!');
    });
});

// GET request to database.
// Send to front-end all of user's widget depending on the userName.
app.get('/refreshWidget', function(req, res) {
    var Widget = require('./models/widget');
    Widget.find({userName: req.user.name}, function(err, widgetList) {
        res.send(widgetList);
    });
});

// GET request in database to send the steamId to front-end
// If user is not connected to Twitch, he can't make te request.
app.get('/getSteamId', function(req, res) {
    var User = require('./models/user');

    User.findOne({username: req.user.name}, function(err, user) {
        if (user) {
            res.json({id: user.steamId});
        } else {
            res.send('');
        }
    });
});

// GET request in database to send the twitchName to front-end
// If user is not connected to Twitch, he can't make te request.
app.get('/getTwitchName', function(req, res) {
    var User = require('./models/user');

    User.findOne({username: req.user.name}, function(err, user) {
        if (user) {
            res.json({twitchName: user.twitchName});
        } else {
            res.send('');
        }
    });
});

// Add a document in widget collection
// Make for steal request.
app.post('/addSteamWidget', function(req, res) {
    var Widget = require('./models/widget');

    var steamWidget = new Widget ({
        widgetName: 'steam',
        description: 'Steam widget containing stats about one game',
        userName: req.user.name,
        url: req.body.url
    });
    steamWidget.save(function (err) {
        if (err) {
            throw err;
        };
        console.log('Steam widget add !');
    });
    res.send(null);
});

// Add a document in widget collection
// Make for twitch request.
app.post('/addTwitchWidget', function(req, res) {
    var Widget = require('./models/widget');

    var steamWidget = new Widget ({
        widgetName: 'twitch',
        description: 'Twitch widget inform followers of a channel',
        userName: req.user.name,
        url: req.body.url
    });
    steamWidget.save(function (err) {
        if (err) {
            throw err;
        };
        console.log('Twitch widget add !');
    });
    res.send("res");
});

// Delete a specific widget
// Delete depending on the button clicked (Id)
app.post('/deleteWidget', function(req, res) {
    var Widget = require('./models/widget.js');

    Widget.deleteMany({_id : req.body.id}, function (err) {});
})

// The post request to remove all of user widget.
// Delete in function of userName make in the request.
app.post("/removeAllWidget", function(req, res) {
    var Widget = require("./models/widget.js");

    Widget.deleteMany({userName: req.user.name}, function (err) {});
});