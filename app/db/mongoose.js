//Połączenie z bazą danych

const mongoose = require('mongoose');   //pobieramy bibliotekę mongoose z npm
const { database } = require('../config'); 

mongoose.connect(database);