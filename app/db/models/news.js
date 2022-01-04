// require('../mongoose'); //normalnie to bedzie używane w app.js (dodałem tutaj dla testów danej kolekcji)

const mongoose = require('mongoose'); //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
const uniqueValidator = require('mongoose-unique-validator'); //lib do walidacji unique
const { checkSlug } = require('../validators'); //walidacje do konkretnych pól w osobnym pliku

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const newsSchema = new Schema({
    mainTitle: {
        type: String,
        required: [true, 'Tytuł jest wymagany!'],
        minLength: [3, 'Minimalna liczba znaków to 3'],
        maxLength: [40, 'Maksymalna liczba znaków to 40!'],
    },
    slug: {
        type: String,
        required: [true, 'Slug jest wymagany!'],
        minLength: [3, 'Minimalna liczba znaków to 3'],
        // maxLength: [20, 'Maksymalna liczba znaków to 20!'],
        trim: true,
        lowercase: true,
        unique: true,
        validate: [checkSlug, 'Znaki specjalne są niedozwolone!'],
    },
    date: {
        type: Date,
    },
    image: {
        type: String,
    },
    text: {
        type: String,
        required: [true, 'Tekst jest wymagany'],
        minLength: [10, 'Minimalna liczba znaków to 10'],
    },
    //referencje
    author: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comment',
    }],
});
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

//Sprawdzanie unikalności sluga
newsSchema.plugin(uniqueValidator, {
    message: 'Ten {PATH} już istnieje!'
});

const News = mongoose.model('News', newsSchema);

module.exports = News;