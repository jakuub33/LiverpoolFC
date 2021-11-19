//Zmienne przekazywane do widoków dla usera

module.exports = function (req, res, next) {
    res.locals.user = req.session.user //zalogowany user
    next();
};