const User = require('../db/models/user');

class UserController {
    showRegister(req, res) {
        //renderuje stronę rejestracji
        res.render('pages/auth/register', {
            title: 'Rejestracja' //tytuł karty czyli title, który jest w header
        });
    }

    async register(req, res) {
        const user = new User({
            //odczytuje wpisane wartości do formularza
            nick: req.body.nick,
            email: req.body.email,
            password: req.body.password
        });

        try {
            await user.save(); //zapisuje usera do bazy
            res.redirect('/zaloguj'); //po rejestracji przekierowanie na strone logowania           
        } catch (e) {
            //jeśli zostanie wyłapany błąd, to generujemy ponownie stronę rejestracji i pokazujemy błędy
            res.render('pages/auth/register', {
                title: 'Rejestracja',
                errors: e.errors, //przekazujemy błędy
                form: req.body //musimy przesłać dane z formularza, aby nie zniknęły po odświeżeniu
            });
        }
    }

    showLogin(req, res) {
        //renderuje stronę logowania
        res.render('pages/auth/login', {
            title: 'Logowanie'
        });
    }

    async login(req, res) {
        try {
            //znajdujemy usera po wpisanym mailu
            const user = await User.findOne({
                email: req.body.email
            });

            //sprawdzam czy user istnieje
            if (!user) {
                throw new Error('user not found');
            } else {
                //sprawdzenie czy user wpisał poprawne hasło
                const isValidPassword = user.comparePassword(req.body.password);
                if (!isValidPassword) {
                    throw new Error('password not valid');
                }
            }

            // LOGOWANIE
            //Użyjemy biblioteki express-session i cookie-parser
            //Odpowiednio tool do zarządzania sesją i tool do czytania cookies

            //przechowywanie sesji, a w niej dane usera, dzieki temu wiadomo kto jest zalogowany
            req.session.user = user;
            res.redirect('/'); //po zalogowaniu przekierowania na stronę główną
        } catch (e) {
            res.render('pages/auth/login', {
                title: 'Logowanie',
                errors: true,
                form: req.body, //przesłanie danych z formularza, aby nie zniknęły po odświeżeniu
            });
        }
    }

    // WYLOGOWANIE
    logout(req, res) {
        req.session.destroy(); //usunięcie zalogowanej sesji
        res.redirect('/'); //przekierowania na stronę główną
    }

    // EDYCJA PROFILU
    showProfile(req, res) {
        res.render('pages/auth/profile', {
            title: 'Mój profil',
            form: req.session.user, //przekazanie wpisanego maila w form
        });
    }

    async update(req, res) {        
        //wyszukuje usera po ID i podmieniam nowe wpisane dane
        const user = await User.findById(req.session.user._id); 
        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;

        // jeśli zostało podane hasło to aktualizujemy je
        if (req.body.password) {
            user.password = req.body.password;
        }
        
        try {
            await user.save();
            req.session.user = user; //aktualizacja sesji

            res.redirect('/zalogowany/profil'); //wyświetla ponownie formularz
        } catch (e) {
            res.render('pages/auth/profile', {   
                title: 'Mój profil',             
                errors: e.errors,
                form: req.body
            }); 
        }
    }
}

module.exports = new UserController();