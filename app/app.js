//Tutaj będzie ogólna aplikacja

const express = require('express');
const path = require('path'); //biblioteka Node - pomaga znalezc sciezke z plikiem
const ejsLayouts = require('express-ejs-layouts'); //biblioteka - umieszcza elementy na kilku stronach
const app = express();
const cookieParser = require('cookie-parser'); //tool do zarządzania sesją
const session = require('express-session'); //tool do czytania cookies
const sessionKeySecret = 'df3f12d390hjkhj0k';

// init database
require('./db/mongoose');

// session
app.use(session({
    secret: sessionKeySecret, //tajny klucz dla sesji (dodatkowe zabezpieczenie)
    saveUninitialized: true, //jeśli będzie 'false' to sesja będzie usuwana po odświeżeniu 
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 1 }, //1 day - jak długo mają istnieć cookies w milisekundach
    resave: false, //zapisywanie sesji na serwer
}));

// view engine
app.set('view engine', 'ejs'); //informuje o użyciu EJS
app.set('views', path.join(__dirname + '/../views')); //i trzeba wskazac folder z widokami (html)

// set layout
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// public folder - CSS, JavaScript
app.use(express.static('public'));

//body parser // application/x-www-form-urlencoded
//odczyta wartości z formularza i zapisze do wartości body
app.use(express.urlencoded({ extended: true }));   //extended:true - parser rozpozna wszystkie typy danych
app.use(cookieParser());

//middleware - wstrzykuje coś przed przejściem do kontrolera, możemy go przypisać do konkretnego adresu
//Można dodać kolejne middlewares i będą wykonywane po kolei dzięki funkcji next()
app.use('/', require('./middleware/view-middleware'));
app.use('/', require('./middleware/user-middleware'));
//Strony, do których mają dostęp tylko zalogowani posiadają na początku w url '/zalogowany', to takie zabezpieczenie
app.use('/zalogowany', require('./middleware/access-middleware')); //sprawdza czy user jest zalogowany

// mount routes
app.use(require('./routes/web'));

module.exports = app; //eksportuje domyślnie aplikację jako zmienną app