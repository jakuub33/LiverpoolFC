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
        res.render('pages/history/history', {
            title: 'Historia'
        });
    }

    showStadium(req, res) {    
        res.render('pages/history/stadium', {
            title: 'Stadion'
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
}

module.exports = new PageController();