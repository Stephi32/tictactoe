const   express = require('express'),
        app = express(),
        port = 3000,
        bodyParser = require('body-parser');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

const games = {};
const game_ids = [];

app.get('/game', (req, res) => {
    let game = null;
    if (!req.query.id) {
        res.status(422).send('A game ID must be provided.');
        return;
    }
    if (game_ids.indexOf(req.query.id) > -1) {
        game = games[req.query.id];
    } else {
        game = {
            id: req.query.id,
            data: new Array(3).fill().map(u => new Array(3).fill(null))
        };
        games[req.query.id] = game;
        game_ids.push(req.query.id);
    }
    res.json(game);
});

app.post('/game-action', (req, res) => {
    const id = req.body.id;
    console.log(`ID: ${id}; Games: `, games);
    let index = game_ids.indexOf(id);
    if (index === -1) {
        res.status(404).send('Game not found');
        return;
    }
    const x = req.body.x;
    const y = req.body.y;
    const player = req.body.player;
    if (player !== 'X' && player !== 'O') {
        console.log(`Invalid player`);
        res.status(404).send('Invalid player. Player must be "X" or "O"');
        return;
    } else if (x < 0 || y < 0 || x > 2  || y > 2) {
        console.log(`Invalid position`);
        res.status(422).send('Invalid position. Postion must be an integer greater than zero and less than two.');
        return;
    } else if (!games) {
        console.log(`Internal error`);
        res.status(500).send('Internal error');
        return;
    } else if (games[id].data[x][y]) {
        console.log(`Invalid position. Position taken`);
        res.status(422).send('Invalid position. Position Already taken.');
        return;
    } else {
        console.log(`Params valid!`);
        games[id].data[x][y] = player;
        res.status(200).json(games[id]);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))