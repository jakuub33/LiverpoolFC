//Uruchomianie serwera

const app = require('./app.js')   //pobieramy applikacje
const port = 80; //port domyślny

app.listen(port, () => {
    console.log(`Server uruchomiony na porcie: ${port}`);
});