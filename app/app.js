//Tutaj będzie ogólna aplikacja

const express = require('express');
const path = require('path'); //biblioteka Node - pomaga znalezc sciezke z plikiem
const ejsLayouts = require('express-ejs-layouts'); //biblioteka - umieszcza elementy na kilku stronach
const app = express();
const cookieParser = require('cookie-parser'); //tool do zarządzania sesją
const session = require('express-session'); //tool do czytania cookies
const { sessionKeySecret } = require('./config');
const helmet = require('helmet'); //biblioteka pomagająca w zabezpieczeniach apki
const rateLimiterMiddleware = require('./middleware/rate-limiter-middleware'); //zabezpieczenia Brute-force / DDOS

// init database
require('./db/mongoose');

// helps secure Express apps by setting various HTTP headers
// w razie problemów, można helmet zakomentować i odświeżyć stronę z usunięciem cache (Ctrl + F5)
app.use(helmet({
    //ustawiamy jakie linki chcemy akceptować (dyrektywy)
    //dopóki nie skończe aplikacji nie chce komplikować dodawania zewnętrznych linków, można to włączyć na koniec
    contentSecurityPolicy: false
})); 
app.use(rateLimiterMiddleware);

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
app.use(express.json()); //parser dla JSON

//middleware - wstrzykuje coś przed przejściem do kontrolera, możemy go przypisać do konkretnego adresu
//Można dodać kolejne middlewares i będą wykonywane po kolei dzięki funkcji next()
app.use('/', require('./middleware/view-middleware'));
app.use('/', require('./middleware/user-middleware'));
//Strony, do których mają dostęp tylko zalogowani posiadają na początku w url '/zalogowany', to takie zabezpieczenie
app.use('/zalogowany', require('./middleware/access-middleware')); //sprawdza czy user jest zalogowany

// mount routes
//API - najpierw, żeby był rozpoznawalny adres w web.js
app.use('/api', require('./routes/apiRoute')); //dodajemy do URL /api, wszystko co związane z api, będzie zaczynać się od /api
app.use(require('./routes/web'));

module.exports = app; //eksportuje domyślnie aplikację jako zmienną app