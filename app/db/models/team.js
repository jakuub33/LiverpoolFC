require('../mongoose'); //normalnie to bedzie używane w app.js (dodałem tutaj dla testów danej kolekcji)

const mongoose = require('mongoose');   //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
const { checkNumber } = require('../validators');

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const teamSchema = new Schema({    
    name: {
        type: String,
        required: [true, 'Imię jest wymagane!'],
        maxLength: [40, 'Maksymalna liczba znaków to 40!'],
    },
    surname: {
        type: String,
        required: [true, 'Nazwisko jest wymagane!'],
        maxLength: [40, 'Maksymalna liczba znaków to 40!'],
    },
    country: {
        type: String,
        required: [true, 'Kraj jest wymagany!'],
        maxLength: [40, 'Maksymalna liczba znaków to 40!'],
    },
    birthday: {
        type: Date,
        //trim: true, //nie usuwa białych znaków
        min: ['1960-01-01', 'Minimalna data to 1960-01-01!'], 
        max: ['2021-01-01', 'Maksymalna data to 2021-01-01!'], 
        //validate: [checkBirthday, 'Niepoprawna data urodzin!'], //poprawić albo pobierać tylko datę bez godziny
    }, 
    number: {
        type: Number,
        required: [true, 'Numer koszulki jest wymagany!'],
        min: [1, 'Najmniejszy numer to 1!'],
        max: [99, 'Największy numer to 99!'],
        validate: [checkNumber, 'Niepoprawna cyfra!'], //obsłużyć wprowadzenie litery (zmienić komunikat na polski), jeśli typem jest Number
    },    
    position: {
        type: String,
        required: [true, 'Pozycja jest wymagana!'],
        enum: {
            values: ['bramkarz', 'obrońca', 'pomocnik', 'napastnik'],
            message: 'Niepoprawna pozycja piłkarza! Proszę wybrać: bramkarz, obrońca, pomocnik, napastnik.'
        },
    },
  });
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

const Team = mongoose.model('Team', teamSchema);

async function saveTeam() {   
    //utworzenie nowego elementu
    const team = new Team({
        name: 'Sadio',
        surname: 'Mane',
        country: 'Senegal',
        birthday: '1961-01-01',
        number: 10,
        position: 'napastnik',
    });

    try {
        await team.save();     
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
saveTeam();

//module.exports = Team;