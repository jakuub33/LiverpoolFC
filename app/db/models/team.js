const mongoose = require('mongoose');   //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
// const { } = require('../validators');

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const teamSchema = new Schema({    
    name: {
        type: String,
    },
    birthday: {
        type: Date,
    }, 
    nationality: {
        type: String,
    },
    position: {
        type: String,
    },
    number: {
        type: Number,
    },
    image: {
        type: String,
    }    
});
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;