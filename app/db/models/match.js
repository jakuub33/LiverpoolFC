require('../mongoose'); //normalnie to bedzie używane w app.js (dodałem tutaj dla testów danej kolekcji)

const mongoose = require('mongoose');   //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
//const {  } = require('../validators');

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const matchesSchema = new Schema({    
    winner: {
        type: String,
        //druzyna home LUB away
    },  
    teams: {
        type: String,
        //home
        //away
    },
    date: {
        type: Date,
        //data
        //godzina
    },      
  });
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

const Matches = mongoose.model('Matches', matchesSchema);

module.exports = Matches;