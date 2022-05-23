
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

var { expressjwt: jwt } = require("express-jwt");

const jwksRsa = require('jwks-rsa');


const {startDatabase} = require('./database/mongo');
const {insertAd, getAds} = require('./database/ads');
const {deleteAd, updateAd} = require('./database/ads');

// defining the Express app
const app = express();



// prior express 4.17
// body-parser doesn’t have to be installed as a separate package
// because it is a dependency of express version 4.16.0+.
//const bodyParser = require("body-parser");
//using bodyParser to parse JSON bodies into JS objects
//app.use(bodyParser.json());

// Using express.urlencoded middleware
//app.use(express.urlencoded({
//  extended: true
//}))

// Update for Express 4.16+
// Starting with release 4.16.0, a new express.json() middleware is available.
app.use(express.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));



// defining an endpoint to return all ads
app.get('/', async (req, res) => {
  res.send(await getAds());
});


const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://cunbm.eu.auth0.com/.well-known/jwks.json'
  }),
  // Validate the audience and the issuer.
  audience: 'https://prw.cunbm.ro',
  issuer: 'https://cunbm.eu.auth0.com/',
  algorithms: ['RS256']
});


app.use(checkJwt);


app.post('/', async (req, res) => {
  const newAd = req.body;
  //console.log(newAd);
  await insertAd(newAd);
  res.send({ message: 'New ad inserted.' });
});


// endpoint to delete an ad
app.delete('/:id', async (req, res) => {
  //console.log(req.params);
  //console.log(req.params.id);
  await deleteAd(req.params.id);
  res.send({ message: 'Ad removed.' });
});


// endpoint to update an ad
app.put('/:id', async (req, res) => {
  const updatedAd = req.body;
  await updateAd(req.params.id, updatedAd);
  res.send({ message: 'Ad updated.' });
});


// start the in-memory MongoDB instance
startDatabase().then(async () => {
  await insertAd({title: 'Hello, again from Mongo!'});

  // start the server
  app.listen(3001, async () => {
    console.log('listening on port 3001');
  });
});

