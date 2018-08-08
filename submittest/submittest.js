let token = 'g58vsjR7sPDROm05Z6UqfPplNFe6txDtq377B0U0R8I='
let data = [{_id: 'Comakip', answers: 38},{_id: 'ruff', answers: 3},{_id: 'Jerry', answers: 11},{_id: 'Ballk', answers: 12},]

function json(response) {
  return response.json()
}

window.fetch('http://localhost:8002/submit', {
    method: 'POST',
    headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Authorization": `bearer ${token}`
    },
    body: JSON.stringify(data),
})
.then(json)
.then( (data) => console.log('Request succeeded with JSON response', data))
.catch( (err) => console.log('Request failed', err))