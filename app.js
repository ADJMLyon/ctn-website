let express = require('express'), session = require('express-session');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let passport = require('passport'), OAuth2Strategy = require('passport-oauth2').Strategy, LocalStrategy = require('passport-local').Strategy;

let app = express();

/* Passport */

/*passport.use(new OAuth2Strategy({
    authorizationURL: 'https://www.myecl.fr/oauth/v2/auth',
    tokenURL: 'https://www.myecl.fr/oauth/v2/token',
    clientID: 'EXAMPLE_CLIENT_ID',
    clientSecret: 'EXAMPLE_CLIENT_SECRET',
    callbackURL: "http://localhost/login/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    'https://www.myecl.fr/api/users'
    User.findOrCreate({ login: profile.username }, function (err, user) {
      return cb(err, user);
    });
  }
));*/
var Account = require('./models/local_passport');
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
    session: true
  }, Account.authenticator));
passport.serializeUser(Account.serializeUser);
passport.deserializeUser(Account.deserializeUser);
const passportMiddleware = passport.authenticate('local', { failureRedirect: '/login' });
const loggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    next();
  else
    res.redirect('/login');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true; //app.get('env') === 'development';

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: 'ctn_secret_beta_test', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', loggedIn, (req, res) => {
  if (req.isAuthenticated()) res.redirect('/');
  else res.render('login');
});

app.post("/login",
    passportMiddleware,
    function (req, res) {
        res.redirect("/");
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

//app.use(passport.authenticate('oauth2', { failureRedirect: '/login' }));

app.get('/login/callback', loggedIn, (req, res) => {
  res.redirect('/');
});

app.get('/mediapiston', loggedIn, (req, res) => {
  res.render('mediapiston_home');
});

app.get('/mediapiston/watch/:videoid', loggedIn, (req, res) => {
  res.render('mediapiston_video');
});

app.get('/pret-matos', loggedIn, (req, res) => {
  res.render('materiel');
});

app.get('/ctn-asso', loggedIn, (req, res) => {
  res.redirect('/');
});

// 404
app.use((req, res) => {
    res.status(404);
    res.render('error', {
        message: 'Page non trouvée !',
        error: {}
    });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 80);

let server = app.listen(app.get('port'), () => {
	console.log('Express server listening on port ' + server.address().port);
});
