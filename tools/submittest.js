let token = 'yB7J9NP1dWHUGUdZwvck5YEKMTeAhJaboNzkeJZiSCQ=';
let data = [{_id: 'Comakip', answers: 3},{_id: 'ruff', answers: 3},{_id: 'Jerry', answers: 11},{_id: 'Ballk', answers: 12}];
let data1 = [{_id: 'Comakip', answers: 38}];

function json(response) {
  return response.json()
}

window.fetch('http://localhost:8002/submit', {
    method: 'POST',
    headers: {
        "Content-type": "application/json",
        "Authorization": `bearer ${token}`
    },
    body: JSON.stringify(data)
})
.then(response => console.log(response)) // parses response to JSON
.catch(error => console.error(`Fetch Error =\n`, error));