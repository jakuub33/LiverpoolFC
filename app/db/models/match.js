//Model do pobierania konkretnego meczu z danej kolejki
//require('../mongoose'); //do testów, potem połączenie z bazą będzie użyte w index.js

const mongoose = require('mongoose');   //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
//const {  } = require('../validators');

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const matchSchema = new Schema({    
    gameweek: {
        type: String,
    },
    date: {
        type: String,
    },
    homeTeam: {
        type: String,
    },
    scoreHomeTeam: {
        type: Number,
    },
    awayTeam: {
        type: String,
    },
    scoreAwayTeam: {
        type: Number,
    },  
    winner: {
        type: String,
    },   
    status: {
        type: String,
    }      
  });
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;