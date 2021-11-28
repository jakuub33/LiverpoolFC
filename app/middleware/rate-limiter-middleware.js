// Dzięki tej bibliotece zabezpieczamy przed Brute-force i DDOS
const { RateLimiterMemory } = require('rate-limiter-flexible'); //zapisywanie połączeń w pamięci serwera

const rateLimiter = new RateLimiterMemory({
    points: 20, //na ile requestów chcę zezwolić
    duration: 1 //przez ile sekund
});

const rateLimiterMiddleware = (req, res, next) => {
    //sprawdzamy na podstawie IP
    rateLimiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send('Too many requests!')
        });
}

module.exports = rateLimiterMiddleware;