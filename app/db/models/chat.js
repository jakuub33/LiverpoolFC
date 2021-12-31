// require('../mongoose'); //normalnie to bedzie używane w app.js (dodałem tutaj dla testów danej kolekcji)

const mongoose = require('mongoose'); //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
const uniqueValidator = require('mongoose-unique-validator'); //lib do walidacji unique
const { checkSlug } = require('../validators'); //walidacje do konkretnych pól w osobnym pliku

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const chatSchema = new Schema({
    nameChat: {
        type: String,
        required: [true, 'Nazwa chatu jest wymagana!'],
        minLength: [3, 'Minimalna liczba znaków to 3'],
        maxLength: [40, 'Maksymalna liczba znaków to 40!'],
    },
    slug: {
        type: String,
        required: [true, 'Slug jest wymagany!'],
        minLength: [3, 'Minimalna liczba znaków to 3'],
        trim: true,
        lowercase: true,
        unique: true,
        validate: [checkSlug, 'Znaki specjalne są niedozwolone!'],
    },
    author: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    messages: [{
        type: mongoose.Types.ObjectId,
        ref: 'Message',
    }],
});
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

//Sprawdzanie unikalności sluga
chatSchema.plugin(uniqueValidator, {
    message: 'Ten {PATH} już istnieje!'
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;