const personalToken = "232846b35e7f4c199efb0cd92f5731c7"
// const url = "https://api.football-data.org/v2/matches"
// const url = "https://api.football-data.org/v2/competitions/PL/matches"
// const url = "http://api.football-data.org/v2/teams/18"
// const url = "http://api.football-data.org/v2/competitions/2021/standings"


export const getDataForShedule = () => {
    return fetch(`https://api.football-data.org/v2/teams/64/matches`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': personalToken
    }}).then(resp => resp.json())
    .catch((error) => {
        alert("Wystąpił problem z danymi")
        console.error('Error:', error);
    });
}

export const getDataForTable = () => {
    return fetch(`http://api.football-data.org/v2/competitions/PL/standings`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': personalToken
    }}).then(resp => resp.json())
    .catch((error) => {
        alert("Wystąpił problem z danymi")
        console.error('Error:', error);
    });
}
