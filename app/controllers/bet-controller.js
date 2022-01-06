const Match = require('../db/models/match.js');
const Score = require('../db/models/score');
const Player = require('../db/models/player');

class BetController {

    async postMatches(req, res) {
        // console.log(req.body); //req.body to przekazywany obiekt

        let matchCurrent = req.body.matchCurrent; //tablica obiektów - ukończony mecz 
        matchCurrent = matchCurrent[0];        

        let matchUpcoming = req.body.matchUpcoming; //tablica obiektów - nadchodzący mecz
        matchUpcoming = matchUpcoming[0];

        const score = await Score.findOne({ gameweek: matchCurrent.matchday });
        score.correctScoreHome = matchCurrent.score.fullTime.homeTeam;
        score.correctScoreAway = matchCurrent.score.fullTime.awayTeam;

        try {
            const matchObject = new Match({
                gameweek: matchCurrent.matchday,
                date: matchCurrent.utcDate,
                homeTeam: matchCurrent.homeTeam.name,
                scoreHomeTeam: matchCurrent.score.fullTime.homeTeam,
                awayTeam: matchCurrent.awayTeam.name,
                scoreAwayTeam: matchCurrent.score.fullTime.awayTeam,
                winner: matchCurrent.score.winner,
                status: matchCurrent.status,
            });

            await score.save();
            await matchObject.save();
            res.status(201); //dokument został utworzony
        } catch (e) {
            console.log('error');
            res.status(422).json({
                errors: e.errors
            });
        }

        try {
            const matchObject = new Match({
                gameweek: matchUpcoming.matchday,
                date: matchUpcoming.utcDate,
                homeTeam: matchUpcoming.homeTeam.name,
                scoreHomeTeam: matchUpcoming.score.fullTime.homeTeam,
                awayTeam: matchUpcoming.awayTeam.name,
                scoreAwayTeam: matchUpcoming.score.fullTime.awayTeam,
                winner: matchUpcoming.score.winner,
                status: matchUpcoming.status,
            });

            await matchObject.save();
            res.status(201); //dokument został utworzony
        } catch (e) {
            console.log('error');
            res.status(422).json({
                errors: e.errors
            });
        }
    };

    async showBetScore(req, res) {
        // TYPOWANIE WYNIKU I WYTYPOWANE WYNIKI
        const matchScheduled = await Match.findOne({ status: 'SCHEDULED'}); //mecz do wytypowania
        const matchFinished = await Match.findOne({ status: 'FINISHED'}); //mecz do pokazania rzeczywistego wyniku

        let userScore, historyScores; 
        let resultsHeader = `Wytypuj wynik`;
        let gameweekHeader = matchScheduled.gameweek;
        let earlierGameweek = matchFinished.gameweek; //wczytujemy wcześniej wytypowaną kolejke

        // sprawdzanie czy mecz do wytypowania już się rozpoczął
        const nowDate = new Date();        
        let matchDate = new Date(matchScheduled.date); //data meczu
        let matchNotStarted = false;
        if (nowDate < matchDate) {
            matchNotStarted = true;
        }

        // sprawdzenie czy user jest zalogowany, jeśli tak to pokaż typowanie
        if (req.session.user) {
            //wczytujemy typy zalogowanego usera
            userScore = await Score.findOne({ player: req.session.user.nick, gameweek: matchScheduled.gameweek }); 
            
            //Jeśli istnieją wytypowane wyniki to zmień header h3            
            if (userScore) {
                resultsHeader = 'Twój wytypowany wynik';            
            }       
            
            //wczytujemy wcześniej wytypowane kolejki, aby pokazać czy wyniki zostały trafione                      
            historyScores = await Score.find({ player: req.session.user.nick }).sort([['gameweek', -1]]);  
            //Najnowsze typy dodawana są na koniec, więc sortuje kolekcję, żeby pokazywało wcześniejsze wyniki od ostatniej kolejki do najstarszej          
        } else {
            // console.log('dla niezalogowanego schowaj typowanie');
        }

        // RANKING #################################################  
        //wczytujemy wszystkie wytypowane wyniki do wyświetlenia rankingu
        const scores = await Score.find({});
            
        //wczytujemy wyniki z ostatniej kolejki
        const lastScores = await Score.find({ gameweek: earlierGameweek });

        //trzeba sprawdzić ilu użytkowników jest graczem czyli wytypowało przynajmniej raz wynik
        const players = await Player.find({});

        //Tablica obiektów dla każdego gracza, aby zliczyć punkty i posortować od najlepszego
            let playerObjects = []; 
            for (const player of players) {    
                let playerObj = {
                    playerNick: player.playerNick,
                    playerGWpoints: 0,
                    playerAllPoints: 0
                }

                let userGWpoints = 0; //Suma punktów z ostatniej kolejki
                let userAllPoints = 0; //Suma punktów z każdego typu
                
                //Zliczanie wszystkich punktów danego gracza
                for (const score of scores) {      
                    // Podliczanie punktów dla konkretnego gracza
                    if (score.player == player.playerNick) {
                        // Sprawdzenie czy player coś typował
                        if (score.points >= 0) {
                            userAllPoints += score.points;
                        }
                    }
                }

                //Zliczanie punktów z ostatniej kolejki danego gracza
                for (const score of lastScores) {
                    // Podliczanie punktów dla konkretnego gracza
                    if (score.player == player.playerNick) {
                        // Sprawdzenie czy gracz typował
                        if (score.points >= 0) {
                            userGWpoints += score.points;
                        }
                    }
                }

                // Przypisanie zsumowanych pkt do obiektu konkretnego gracza
                playerObj.playerGWpoints = userGWpoints;
                playerObj.playerAllPoints = userAllPoints;
                playerObjects.push(playerObj);
            }
            // Sortowanie graczy od najlepszego
            playerObjects.sort((a, b) => (a.playerAllPoints > b.playerAllPoints) ? -1 : 1)
        // #########################################################

        //Widok bet-score.ejs, { parametry, które chcemy przesłać }
        res.render('pages/bet/bet-score', {
            title: 'Typowanie wyników',
            scores,
            playerObjects,
            matchNotStarted,
            matchScheduled,
            matchFinished,
            userScore,
            historyScores,
            resultsHeader,
            gameweekHeader,
        });
    }

    // TYPOWANIE
    async betButton(req, res) {        
        //sprawdzenie czy user jest już graczem/typerem
        const playerExist = await Player.findOne({ playerNick: req.session.user.nick })
        if (!playerExist) {
            const player = new Player({
                playerNick: req.session.user.nick
            });

            try {
                await player.save();
            } catch (e) {
                console.log('PROBLEM Z DODANIEM GRACZA');
                console.log(e);
            }
        }

        //pobieramy następną kolejkę
        const scheduledMatch = await Match.findOne({ status: 'SCHEDULED'});     

        try {          
            const score = new Score({                  
                date: scheduledMatch.date,
                gameweek: scheduledMatch.gameweek,
                homeTeam: scheduledMatch.homeTeam,
                scoreHome: req.body.homeTeamScore || undefined, //jeśli będzie pusty input to zostanie nadana wartośćdefaultowa, bez tego warunku zostanie nadana wartość "null"
                awayTeam: scheduledMatch.awayTeam,
                scoreAway: req.body.awayTeamScore || undefined,       
                player: req.session.user.nick         
            });
             
            await score.save();  
        } catch (e) {
            console.log('PROBLEM Z TYPOWANIEM');
            console.log(e);
        }
           
        
        // Po wciśnięciu przycisku Wytypuj, odświeżamy stronę
        try { 
            res.redirect(`/typowanie-wyniku`); 
        } catch (e) {            
            console.log(e);
            // res.render('pages/leagues');
        }
    }
}

module.exports = new BetController();