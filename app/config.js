//Konfiguracja

require('dotenv').config(); //użycie biblioteki dotenv, importuje wartości z pliku .env

module.exports = {
    port: process.env.PORT || 80, //jeśli nie pobierze wartości z .env to domyślnie port 80
    database:  process.env.DATABASE || 'mongodb://localhost:27017/Liverpool',
    sessionKeySecret: process.env.SESSION_KEY_SECRET //tajny klucz dla sesji (dodatkowe zabezpieczenie)
};