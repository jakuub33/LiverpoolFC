//Każdy model ma swój controller, dla głównej inny, dla ligi inny itd

class PageController {
    //Strona główna
    showHome(req, res) {    
        res.render('pages/home', {
            title: 'Strona główna'
        });
    }

    showSchedule(req, res) {    
        res.render('pages/schedule', {
            title: 'Terminarz'
        });
    }

    showTable(req, res) {    
        res.render('pages/table', {
            title: 'Tabela'
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