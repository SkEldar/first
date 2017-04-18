require('dotenv').config();
const express = require('express');
const Promise = require('bluebird');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const users = require('./users');
const auth = require('./auth');
const kill = require('./kill');
const authenticate = require('./middleware/authenticate.js').auth;
const events = require('./events');

const victims = require('./victims');

const mongoose = require('mongoose');
const db = mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//error wrapper, courtesy to Spanish guys
app.use((error, request, response, next) => {
    response.status(400).send('Oops there was an error, ask administrator');
    console.log(error);
    next();
})

app.post('/api', (req, res) => {
    console.log(req.body);
    res.send('OK');
});


let whitelist = [
  'http://localhost:3000',      //this is my front-end url for development
   'https://ilyanoskov.github.io',
   'http://aubgsurvival.fun',
   'http://www.aubgsurvival.fun'
];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
    credentials : true
}

app.use(cors(corsOptions));

app.get('/api/users', users.users);
app.post('/api/users/register', users.register);
app.delete('/api/users', users.delete);
app.get('/api/users/personal',  authenticate, users.personal);

//Auth
app.post('/api/auth',auth.auth);

//events api
app.get('/api/events',events.get);
app.delete('/api/events', events.erase);

//gameplay
app.post('/api/assign', victims.initialAssign);
app.post('/api/kill',authenticate, kill.kill);

app.set('port', (process.env.PORT || 3001));

app.listen(app.get('port'), console.log('Listening on the port ', app.get('port')));
