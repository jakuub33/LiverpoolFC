// require('../mongoose'); //normalnie to bedzie używane w app.js (dodałem tutaj dla testów danej kolekcji)

const mongoose = require('mongoose'); //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
const { engCharacters } = require('../validators'); //walidacje do konkretnych pól w osobnym pliku

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const newsSchema = new Schema({
    mainTitle: {
        type: String,
        required: [true, 'Tytuł jest wymagany!'],
        minLength: [3, 'Minimalna liczba znaków to 3'],
        maxLength: [40, 'Maksymalna liczba znaków to 40!'],
        validate: [engCharacters, 'Znaki specjalne są niedozwolone!'],
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true,
    },
    image: {
        type: String,
    },
    text: {
        type: String,
        required: [true, 'Tekst jest wymagany'],
        minLength: [10, 'Minimalna liczba znaków to 10'],
    },
    author: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: 'Comments',
    }],
});
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

//przypisanie name do slug
newsSchema.pre('save', function (next) {
    const oneNews = this;
    //jeśli liga nie jest dodawana/modyfikowana to nic nie rób, a jeśli tak to przypisz nazwe ligi do slug
    if (!oneNews.isModified('name')) {
        return next();
    } else {
        //slug nie może mieć spacji
        oneNews.slug = oneNews.name.replace(/\s+/g, '');
        next();
    }
});

const News = mongoose.model('News', newsSchema);

module.exports = News;