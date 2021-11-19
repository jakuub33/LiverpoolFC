require('../mongoose'); //normalnie to bedzie używane w app.js (dodałem tutaj dla testów danej kolekcji)

const mongoose = require('mongoose');   //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
//const {  } = require('../validators');

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const choicesSchema = new Schema({    
    user: {
        type: String, //id
    },  
    footballer: {
        type: String, //id
    },  
    user: {
        type: String, //id
    },  
    match: {
        type: String, //id 
    },     
  });
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

const Choices = mongoose.model('Choices', choicesSchema);

module.exports = Choices;
