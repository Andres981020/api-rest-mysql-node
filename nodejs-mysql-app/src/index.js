const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars')
const path = require('path');
const flash = require('connect-flash')
const session = require('express-session');
const mySqlStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys')

// inicializaciones
const app = express();
require('./lib/passport')

// settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(session({
    secret: 'mysession',
    resave: false,
    saveUninitialized: false,
    store: new mySqlStore(database)
}));
app.use(flash());

// Variables globales
app.use((req, res, next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// Rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

// public

// Starting server
app.listen(app.get('port'), ()=>{
    console.log('Server on port', app.set('port'))
});