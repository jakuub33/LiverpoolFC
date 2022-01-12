const Team = require('../db/models/team');

class PageController {
    //Strona główna
    showHome(req, res) {    
        res.render('pages/home', {
            title: 'Strona główna'
        });
    }

    showStatistics(req, res) {    
        res.render('pages/statistics', {
            title: 'Statystyki'
        });
    }
    
    showHistory(req, res) {    
        res.render('pages/history/club', {
            title: 'Historia kubu'
        });
    }

    showStadium(req, res) {    
        res.render('pages/history/stadium', {
            title: 'Historia stadionu'
        });
    }

    showCrest(req, res) {    
        res.render('pages/history/crest', {
            title: 'Historia herbu'
        });
    }

    showTrophies(req, res) {    
        res.render('pages/history/trophies', {
            title: 'Trofea'
        });
    }

    //adresy 404
    showNotFound(req, res) {
        res.render('errors/404', {
            title: 'Nie znaleziono',
            layout: 'layouts/error' //Strony błędów będa się różnić od zwykłych stron, więc osobny layout            
        });
    }

    async showTeam(req, res) { 
        const goalkeepers = await Team.find({ position: "Goalkeeper" });
        const defenders = await Team.find({ position: "Defender" });
        const midfielders = await Team.find({ position: "Midfielder" });
        const attackers = await Team.find({ position: "Attacker" });
        
        res.render('pages/team', {
            title: 'Skład',
            goalkeepers,
            defenders,
            midfielders,
            attackers
        });
    }
}

module.exports = new PageController();