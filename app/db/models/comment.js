// require('../mongoose'); //normalnie to bedzie używane w app.js (dodałem tutaj dla testów danej kolekcji)

const mongoose = require('mongoose'); //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
// const {  } = require('../validators'); //walidacje do konkretnych pól w osobnym pliku

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const commentSchema = new Schema({    
    text: {
        type: String,
        required: [true, 'Tekst jest wymagany']
    },
    author: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    }
});
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;