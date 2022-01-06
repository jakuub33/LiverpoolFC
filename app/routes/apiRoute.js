const express = require('express');
const router = new express.Router(); //zmieniamy nazwy z app.get na router.get
const BetController = require('../controllers/bet-controller');

//mimo, że nie jest wywoływane, to ten require jest niezbędny do przekazania danych
const dataAPI = require('../controllers/api-controller'); 

router.post('/matches', BetController.postMatches);

module.exports = router;