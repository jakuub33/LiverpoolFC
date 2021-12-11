//Routingi czyli po wejściu na dany adres -> co się dzieje
//Czyli co ma się wykonywać po wejściu na dany adres

const express = require('express');
const router = new express.Router(); //zmieniamy nazwy z app.get na router.get
const UserController = require('../controllers/user-controller');
const PageController = require('../controllers/page-controller');
const NewsController = require('../controllers/news-controller');
const upload = require('../services/uploader'); //odpowiada za wgrywanie zdjęć

// STRONA GŁÓWNA
router.get('/', PageController.showHome);
router.get('/wiadomosci', NewsController.showNews);
router.get('/wiadomosci/:name', NewsController.showOneNews);

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

// TWORZENIE NOWEJ AKTUALNOŚCI
router.get('/zalogowany/wiadomosci/dodaj', NewsController.showCreateNewsForm); //wyświetlenie formularza
//obsługa formularza wysłanego za pomocą POST
// dodajemy middleware, dodajemy jeden plik o nazwie image (nazwa z form)
router.post('/zalogowany/wiadomosci/dodaj', upload.single('image'), NewsController.createOneNews); 

// EDYCJA AKTUALNOŚCI
router.get('/zalogowany/wiadomosci/:name/edytuj', NewsController.showEditNewsForm); //wyświetlenie formularza
// dodajemy middleware, dodajemy jeden plik o nazwie image (nazwa z form)
router.post('/zalogowany/wiadomosci/:name/edytuj', upload.single('image'), NewsController.editNews);

// USUWANIE AKTUALNOŚCI I ZDJECIA
router.get('/zalogowany/wiadomosci/:name/usun', NewsController.deleteNews); 
router.get('/zalogowany/wiadomosci/:name/usun-zdjecie', NewsController.deleteImage);

// KOMENTARZE
router.post('/wiadomosci/:name', NewsController.commentButton); //obsługa formularza wysłanego za pomocą POST
router.post('/wiadomosci/:name/usun-komentarz', NewsController.deleteComment);

// BŁĘDNE ADRESY
router.get('*', PageController.showNotFound);

module.exports = router; //exportujemy routingi