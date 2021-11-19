const personalToken = "06900aadf8064cdab4775b8b1c19db88"
// const url = "https://api.football-data.org/v2/matches"
// const url = "https://api.football-data.org/v2/competitions/PL/matches"
// const url = "http://api.football-data.org/v2/teams/18"
// const url = "http://api.football-data.org/v2/competitions/2021/standings"


export const getDataForShedule = leagueName => {
    return fetch(`https://api.football-data.org/v2/competitions/${leagueName}/matches`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': personalToken
    }}).then(resp => resp.json())
    .catch((error) => {
        alert("Wystąpił problem z danymi")
        console.error('Error:', error);
    });
}

export const getDataForTable = leagueName => {
    return fetch(`http://api.football-data.org/v2/competitions/${leagueName}/standings`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': personalToken
    }}).then(resp => resp.json())
    .catch((error) => {
        alert("Wystąpił problem z danymi")
        console.error('Error:', error);
    });
}
