//Pobieranie danych GET z API i POST jako obiekt do kontrolera
const axios = require('axios');
const Match = require('../db/models/match.js');
const Score = require('../db/models/score.js');
const Team = require('../db/models/team.js');

const headers = {
    'Content-Type': 'application/json',
    'X-Auth-Token': '232846b35e7f4c199efb0cd92f5731c7'
}

let currentGameweek = null;
let isUpdated = null;

//Pobieramy aktualną kolejkę z bazy
async function getCurrentMatchday() {
    //pobieramy aktualną kolejkę danej ligi
    const nextGameweekMatch = await Match.findOne({
        status: "SCHEDULED"
    });

    // przypisujemy do zmiennej kolejke ostatniego meczu
    currentGameweek = nextGameweekMatch.gameweek;
}

//Pobieramy mecze konkretnych kolejek
async function getData(currentMatchday) {
    try {        
        //pobieramy mecze z ostatniej kolejki
        const currentMatches =
            await axios.get(`https://api.football-data.org/v2/competitions/PL/matches?matchday=${currentMatchday}`, {
                headers: headers
            }).then(resp => resp.data.matches)

        //w 10 meczach danej kolejki potrzebujemy tylko mecz Liverpoolu
        let matchCurrent = currentMatches.filter(match =>
            match.homeTeam.name == "Liverpool FC" || match.awayTeam.name == "Liverpool FC");

        //ABY COFNĄĆ DLA TESTU KOLEJKĘ WYŻEJ: parseInt(currentMatchday)-1 A NIŻEJ USUWASZ +

        const upcomingMatchday = parseInt(currentMatchday) + 1;

        //pobieramy mecze z następnej kolejki
        const upcomingMatches = await axios.get(`https://api.football-data.org/v2/competitions/PL/matches?matchday=${upcomingMatchday}`, {
            headers: headers
        }).then(resp => resp.data.matches)

        //w 10 meczach danej kolejki potrzebujemy tylko mecz Liverpoolu
        let matchUpcoming = upcomingMatches.filter(match =>
            match.homeTeam.name == "Liverpool FC" || match.awayTeam.name == "Liverpool FC");

        await axios.post('http://localhost:80/api/matches', {
            matchCurrent,
            matchUpcoming,
        })
    } catch (error) {
        console.error(error);
    }
}

//Sprawdzamy czy trzeba zaktualizować mecze w bazie danych
async function ifDataExist() {   
    const nowDate = new Date();

    const nextGameweekMatch = await Match.findOne({
        status: "SCHEDULED"
    });

    console.log(`Aktualna kolejka: ${currentGameweek}`);

    // Data meczu zaplanowanego
    const matchScheduledDate = new Date(nextGameweekMatch.date)

    // Potrzebujemy datę zakończenia meczu, więc do godziny rozpoczęcia meczu dodajemy 2h
    matchScheduledDate.setHours(matchScheduledDate.getHours() + 2);

    //Jeśli mecz się skończył
    if (nowDate > matchScheduledDate) {

        await Match.deleteMany({}); //usuwamy z bazy wszystkie mecze

        //Dodawanie kolejki  
        getData(currentGameweek);
        console.log(`Zaktualizowano kolejke!`);

        isUpdated = true;
    } else {
        console.log(`Mecz sie jeszcze nie skonczyl`);
        isUpdated = false;
    }
    // }
}

async function addPoints() {
    //sprawdzamy czy została zaktualizowana kolejka dla danej ligi    
    console.log(`Status isUpdated = ${isUpdated}`);
    if (isUpdated) {
        //mecz zakończony z finalnym wynikiem do porownania z typem gracza
        const matchFinished = await Match.findOne({
            gameweek: currentGameweek
        });

        //typy użytkowników
        const scores = await Score.find({
            gameweek: currentGameweek
        });

        // Musimy przejść po wszystkich wynikach
        for (const score of scores) {   
            let points = 0;

            // Sprawdzamy czy wytypowano prawidłowy rezultat meczu
            if ((score.scoreHome > score.scoreAway &&
                matchFinished.scoreHomeTeam > matchFinished.scoreAwayTeam) ||
                (score.scoreHome < score.scoreAway &&
                    matchFinished.scoreHomeTeam < matchFinished.scoreAwayTeam) ||
                (score.scoreHome === score.scoreAway &&
                    matchFinished.scoreHomeTeam === matchFinished.scoreAwayTeam)) {
                points += 1;
            }

            //Sprawdzamy czy wytypowano prawidłowy wynik meczu
            if ((score.scoreHome == matchFinished.scoreHomeTeam) && (score.scoreAway == matchFinished.scoreAwayTeam)) {
                points += 2;
            }

            score.points = points;

            try {
                await score.save();
                console.log("Przydzielono punkty za typowanie");
            } catch (e) {
                console.log('!!! Wykryto błąd z punktacją:')
                console.log(e)
            }
        };
    } else {
        console.log("Kolejka nie została zaktualizowana");
    }    
}

//Pobieramy aktualny skład
async function getTeam() {
    try {     
        const team =
            await axios.get(`https://api.football-data.org/v2/teams/64`, {
                headers: headers
            }).then(resp => resp.data.squad)

        //Powyższym requestem pobieramy cały skład, więc musimy posortować piłkarzy pozycjami
        // let goalkeepers = team.filter(player => player.position == "Goalkeeper");                
        // let defenders = team.filter(player => player.position == "Defender");
        // let midfielders = team.filter(player => player.position == "Midfielder");
        // let attackers = team.filter(player => player.position == "Attacker");

        for (const player of team) {
            const teamObject = new Team({
                name: player.name,
                birthday: player.dateOfBirth,
                nationality: player.nationality,
                position: player.position,
                number: null,
                image: null, 
            });

            try {
                await teamObject.save();
            } catch (e) {
                console.log('error');
                console.log(e);
            }
        }     
    } catch (error) {
        console.error(error);
    }
}

//Najpierw musimy pobrać aktualną kolejkę...
async function loadData() {   
    await getCurrentMatchday()
    await ifDataExist()
    setTimeout(() => {
        addPoints()
    }, 5000);
}

//Aktualizacja składu
// getTeam()

// loadData()