require('../mongoose'); //normalnie to bedzie używane w app.js (dodałem tutaj dla testów danej kolekcji)

const mongoose = require('mongoose');   //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
//const {  } = require('../validators');

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const clubsSchema = new Schema({    
    name: {
        type: String,
        required: [true, 'Nazwa klubu jest wymagana!'],
        minLength: [3, 'Minimalna liczba znaków to 3!'],
        maxLength: [40, 'Maksymalna liczba znaków to 40!'],
    },  
    logo: {
        type: String, //może getter
    },   
  });
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

const Clubs = mongoose.model('Clubs', clubsSchema);

module.exports = Clubs;