require('../mongoose'); //normalnie to bedzie używane w app.js (dodałem tutaj dla testów danej kolekcji)

const mongoose = require('mongoose');   //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
//const {  } = require('../validators');

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const newsSchema = new Schema({    
    title: {
        type: String,
        required: [true, 'Tytuł jest wymagany!'],
        minLength: [3, 'Minimalna liczba znaków to 3'],
        maxLength: [100, 'Maksymalna liczba znaków to 100!'],
    },
    image: {
        type: String, //sprawdz getter
    },
    text: {
        type: String,
        required: [true, 'Tekst jest wymagany'],
        minLength: [10, 'Minimalna liczba znaków to 10'],
    },
    author: {
        type: String, //id
    }, 
    comments: {
        type: String, //id
    },    
  });
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

const News = mongoose.model('News', newsSchema);

module.exports = News;