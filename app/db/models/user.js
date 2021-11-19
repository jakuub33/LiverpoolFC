const mongoose = require('mongoose'); //pobieramy mongoose
const Schema = mongoose.Schema; //pobieramy Schema
const bcrypt = require('bcrypt'); //biblioteka do hashowania hasła
const { checkEmail, checkPassword } = require('../validators'); //walidacje do konkretnych pól w osobnym pliku

//Stworzenie modelu, na podstawie, którego powstanie kolekcja
const userSchema = new Schema({
    nick: {
        type: String,
        required: [true, 'Pole nick jest wymagane'],
        minLength: [3, 'Minimalna liczba znaków to 3'],
        unique: true, //nie można tutaj wyświetlić informacji o błędzie, zostanie dodana niżej jako middleware
    },
    email: {
        type: String,
        required: [true, 'Pole email jest wymagane'],
        lowercase: true,
        trim: true,
        unique: true, 
        validate: [checkEmail, 'Niepoprawny email!'],
    },
    password: {
        type: String,
        required: [true, 'Pole hasło jest wymagane'],
        validate: [checkPassword, 'Hasło musi zawierać od 6 do 20 znaków, przynajmniej 1 cyfra, 1 duża i 1 mała litera!'],
    },
});
//##############################################################
//Operacje po wpisaniu danych przez usera, na których możemy dokonać zmiany przed dodaniem do bd

//hashowanie hasła
userSchema.pre('save', function(next) {
    const user = this;
    //salt - dodatkowe zabezpieczenie utrudniające łamanie haseł (dodaje wartość do hasła)
    if (!user.isModified('password')) {
        return next();
    } else {
        const salt = bcrypt.genSaltSync(10); //10 to moc obliczeniowa
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
        next();
    }
});

//API: Schema.prototype.post() - uruchamia się po zapisie
userSchema.post('save', function(error, doc, next) {
    if (error.code === 11000) {
        //1100 to kod błędu dla pola "unique"
        error.errors = {
            nick: { message: 'Ten nick lub email jest już zajęty!'},
            email: { message: 'Ten nick lub email jest już zajęty!'}
        };
    }
    next(error);
});

//metody ogólnodostępne
userSchema.methods = {
    comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;