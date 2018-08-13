let token = 'yB7J9NP1dWHUGUdZwvck5YEKMTeAhJaboNzkeJZiSCQ=';
let data = [{_id: 'Comakip', answers: 3},{_id: 'ruff', answers: 3},{_id: 'Jerry', answers: 11},{_id: 'Ballk', answers: 12}];
let data1 = [{_id: 'Comakip', answers: 38}];

let newdata = [
    {name: 'Comakip', answers: 5, flair: [1,3]}, 
    {name: 'ruff', answers: 2, flair: [3,2]},
    {name: 'Ballk', answers: 2, flair: [7,2]},
]
let newdate = Date.now();
let newdata2 = [
    {name: 'COMAkip', answers: 5, flair: [1,3], date:newdate}, 
    {name: 'rufF', answers: 2, flair: [5,1], date:newdate},
    {name: '@@@@@@@@@@@@', answers: 2, flair: [7,2], date:newdate}
]
function json(response) {
  return response.json()
}

window.fetch('http://localhost:8002/submit', {
    method: 'POST',
    headers: {
        "Content-type": "application/json",
        "Authorization": `bearer ${token}`
    },
    body: JSON.stringify(newdata2)
})
.then(response => console.log(response)) // parses response to JSON
.catch(error => console.error(`Fetch Error =\n`, error));