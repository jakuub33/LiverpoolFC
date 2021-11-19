//Middleware sprawdzający czy user jest zalogowany

module.exports = function (req, res, next) {
    //Jeśli sesja nie istnieje to user nie jest zalogowany (sesja z danymi usera jest aktywna po zalogowaniu)
    if (!req.session.user) {
        res.redirect('/zaloguj');
    }
    next();
};