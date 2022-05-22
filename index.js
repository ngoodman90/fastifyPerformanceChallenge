const fs = require('fs');
const Fastify = require('fastify')
const app = Fastify()
const port = +process.argv[2] || 3000

const cardsData = fs.readFileSync('./cards.json');
const cardList = [...JSON.parse(cardsData).map(c => JSON.stringify(c))]
const cardListLength = cardList.length
const allCardsResponse = JSON.stringify({id: "ALL CARDS"})

const client = require('redis').createClient()
client.on('error', (err) => console.log('Redis Client Error', err));

client.on('ready', () => {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Example app listening at http://0.0.0.0:${port}`)
    })
})

app.get('/card_add', async (req, res) => {
    client.incr(req.query.id)
        .then(response => response <= cardListLength ?
          res.send(cardList[response - 1]) :
          res.send(allCardsResponse));
})

app.get('/ready', async (req, res) => {
    res.send({ready: true})
})

client.connect();
