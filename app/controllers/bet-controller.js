const Match = require('../db/models/match.js');

class BetController {

    async postMatches(req, res) {
        // console.log(req.body); //req.body to przekazywany obiekt

        let matchCurrent = req.body.matchCurrent; //tablica obiektów - ukończone mecze    
        matchCurrent = matchCurrent[0];        

        let matchUpcoming = req.body.matchUpcoming; //tablica obiektów - nadchodzące mecze
        matchUpcoming = matchUpcoming[0];

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
}

module.exports = new BetController();