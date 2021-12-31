// require('../mongoose'); //normalnie to bedzie używane w app.js (dodałem tutaj dla testów danej kolekcji)

const mongoose = require('mongoose'); //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
// const {  } = require('../validators'); //walidacje do konkretnych pól w osobnym pliku

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const messageSchema = new Schema({    
    text: {
        type: String,
        required: [true, 'Tekst jest wymagany']
    },
    //referencja z użyciem nicku, a nie ID, a było łatwiej było wskazać kto napisał komentarz
    author: {
        type: String,
        required: true,
        ref: 'User',
    }
});
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;