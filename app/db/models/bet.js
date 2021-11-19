require('../mongoose'); //normalnie to bedzie używane w app.js (dodałem tutaj dla testów danej kolekcji)

const mongoose = require('mongoose');   //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
const { checkScore } = require('../validators');

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const betsSchema = new Schema({    
    score: {
        type: String,
        trim: true,
        required: [true, 'Wynik jest wymagany!'],
        minLength: [3, 'Minimalna liczba znaków to 3, np "2:1"'],
        maxLength: [5, 'Maksymalna liczba znaków to 5, np "10:12"'],
        validate: [checkScore, 'Proszę wprowadzić poprawnie wynik, np "2:1"']
    },
    match: {
        type: String, //id 
    },
    user: {
        type: String, //id
    },   
  });
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

const Bets = mongoose.model('Bets', betsSchema);

async function saveBets() {   
    //utworzenie nowego elementu
    const bets = new Bets({
        score: '3:1',
        match: 'm1',
        user: 'u1',
    });

    try {
        await bets.save();     
        console.log(`Zapisano!`);    
    } catch (e) {
        console.log(`Coś poszło nie tak`);        

        //Lepiej wyłapać wszystkie błędy automatycznie niż po kolei
        for (const key in e.errors) {
            console.log(e.errors[key].message);
        }
        console.log(e);
    }
}
saveBets();

// module.exports = Bets;