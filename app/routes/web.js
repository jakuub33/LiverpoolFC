//Routingi czyli po wejściu na dany adres -> co się dzieje
//Czyli co ma się wykonywać po wejściu na dany adres

const express = require('express');
const router = new express.Router(); //zmieniamy nazwy z app.get na router.get
const UserController = require('../controllers/user-controller');
const PageController = require('../controllers/page-controller');

// STRONA GŁÓWNA
router.get('/', PageController.showHome);

// TABELA I TERMINARZ
router.get('/terminarz', PageController.showSchedule);
router.get('/tabela', PageController.showTable);

// REJESTRACJA
router.get('/zarejestruj', UserController.showRegister); // wyświetlanie formularza
router.post('/zarejestruj', UserController.register); // obsługa rejestracji

// LOGOWANIE
router.get('/zaloguj', UserController.showLogin); // wyświetlanie formularza
router.post('/zaloguj', UserController.login); // obsługa logowania
router.get('/wyloguj', UserController.logout); // obsługa wylogowania

// EDYCJA PROFILU
router.get('/zalogowany/profil', UserController.showProfile); // wyświetlanie formularza
router.post('/zalogowany/profil', UserController.update); // obsługa zmiany danych w profilu

// BŁĘDNE ADRESY
router.get('*', PageController.showNotFound);

module.exports = router; //exportujemy routingi