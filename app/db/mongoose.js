//Połączenie z bazą danych

const mongoose = require('mongoose');   //pobieramy bibliotekę mongoose z npm
mongoose.connect('mongodb://localhost:27017/Liverpool');