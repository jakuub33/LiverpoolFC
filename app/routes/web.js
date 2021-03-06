//Routingi czyli po wejściu na dany adres -> co się dzieje
//Czyli co ma się wykonywać po wejściu na dany adres

const express = require('express');
const router = new express.Router(); //zmieniamy nazwy z app.get na router.get
const UserController = require('../controllers/user-controller');
const PageController = require('../controllers/page-controller');
const NewsController = require('../controllers/news-controller');
const ChatController = require('../controllers/chat-controller');
const BetController = require('../controllers/bet-controller');
const upload = require('../services/uploader'); //odpowiada za wgrywanie zdjęć

// STRONA GŁÓWNA
router.get('/', PageController.showHome);

// TABELA I TERMINARZ
router.get('/statystyki', PageController.showStatistics);

// HISTORIA
router.get('/klub', PageController.showHistory);
router.get('/stadion', PageController.showStadium);
router.get('/herb', PageController.showCrest);
router.get('/trofea', PageController.showTrophies);

//SKŁAD
router.get('/sklad', PageController.showTeam);

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

// AKTUALNOŚCI
router.get('/wiadomosci', NewsController.showNews);
router.get('/wiadomosci/:name', NewsController.showOneNews);

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
router.post('/zalogowany/wiadomosci/:name', NewsController.commentButton); //obsługa formularza wysłanego za pomocą POST
router.get('/zalogowany/wiadomosci/:name/:comId/usun-komentarz', NewsController.deleteComment);

// CHAT
router.get('/chat', ChatController.showChats);
router.get('/chat/:name', ChatController.showChat);

// TWORZENIE NOWEGO CHATU
router.get('/zalogowany/chat/dodaj', ChatController.showCreateChatForm); //wyświetlenie formularza
//obsługa formularza wysłanego za pomocą POST
router.post('/zalogowany/chat/dodaj', ChatController.createChat); 

// EDYCJA CHATU
router.get('/zalogowany/chat/:name/edytuj', ChatController.showEditChatForm); //wyświetlenie formularza
// dodajemy middleware, dodajemy jeden plik o nazwie image (nazwa z form)
router.post('/zalogowany/chat/:name/edytuj', ChatController.editChat);

// USUWANIE CHATU
router.get('/zalogowany/chat/:name/usun', ChatController.deleteChat); 

// WIADOMOŚCI W CHACIE
router.post('/zalogowany/chat/:name', ChatController.messageButton); //obsługa formularza wysłanego za pomocą POST

// TYPOWANIE WYNIKU
router.get('/typowanie-wyniku', BetController.showBetScore); //wyświetlanie strony z typowaniem wyniku
router.post('/typowanie-wyniku', BetController.betButton); //obsługa formularza wysłanego za pomocą POST

// BŁĘDNE ADRESY
router.get('*', PageController.showNotFound);

module.exports = router; //exportujemy routingi