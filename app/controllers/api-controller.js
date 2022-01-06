//Pobieranie danych GET z API i POST jako obiekt do kontrolera
const axios = require('axios');
const Match = require('../db/models/match.js');
const Score = require('../db/models/score.js');

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
        const match = await Match.find({
            gameweek: currentGameweek
        });

        //typ użytkownika
        const scores = await Score.find({
            gameweek: currentGameweek
        });

        // Musimy przejść po wszystkich wynikach
        for (const score of scores) {
            //trzeba wyszukać ten sam mecz w tabeli Matches

            //tutaj można to przerobić bo match to bedzie zawsze jeden obiekt a nie tablica obiektow

            let sameMatch = match.find(element => {
                if (score.homeTeam === element.homeTeam) {
                    return score.homeTeam;
                }
            });
            // console.log(`ZNALEZIONY MECZ TO: ${sameMatch} === ${score}`);
            let points = 0;

            // Sprawdzamy czy wytypowano prawidłowy rezultat meczu
            if ((score.scoreHome > score.scoreAway &&
                    sameMatch.scoreHomeTeam > sameMatch.scoreAwayTeam) ||
                (score.scoreHome < score.scoreAway &&
                    sameMatch.scoreHomeTeam < sameMatch.scoreAwayTeam) ||
                (score.scoreHome === score.scoreAway &&
                    sameMatch.scoreHomeTeam === sameMatch.scoreAwayTeam)) {
                points += 1;
            }

            //Sprawdzamy czy wytypowano prawidłowy wynik meczu
            if ((score.scoreHome == sameMatch.scoreHomeTeam) && (score.scoreAway == sameMatch.scoreAwayTeam)) {
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

//Najpierw musimy pobrać aktualną kolejkę...
async function loadData() {
    await getCurrentMatchday()

    // TESTOWANIE NA SZTYWNO       
    // getData(currentGameweek)

    await ifDataExist()
    setTimeout(() => {
        addPoints()
    }, 5000);
}

loadData()