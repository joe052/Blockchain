// import{chain} from ('./progress.js');
// import{express} from ('express');
// import{bodyParser} from ('body-parser');
// import{fetch} from ('node-fetch');

let impots = require("./progress.js");
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const Nodes = require('./nodes.js');

// Load env vars
const url = process.env.URL || '0.0.0.0';
//const port = process.env.PORT || 4000;

const myUrl1 = 'https://blockchain.michomapeter.repl.co/blockchain';
const myUrl = 'https://client-blockchain.joeroyalty00.repl.co';

app.use(bodyParser.urlencoded({ limit: '5000mb', extended: true, parameterLimit: 100000000000 }));
app.use(express.json());

//app.use(express.static('newProject'));

let nodes = new Nodes(url, port);

//testing my server with postman
app.post('/data', (req, res) => {
  console.log(req.body);
});

app.get('/', (req, res) => {
  res.send('Build on progress... @Master');
});

let chainM = [];

app.get('/blockchain', (req, res) => {
  res.send(impots.chain[0]);
});

app.get('/transactions', (req, res) => {
  res.send(impots.trans);
});

app.get('/resolve',(req,res) =>{
  nodes.resolve(res, impots.chain);
});

app.get('/allNodes',(req,res) =>{
  nodes.allNodes(res);
});

//console.log(impots.chain);
//nodes.broadcast();
//impots.teest(myUrl);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

//https://geshan.com.np/blog/2021/01/free-nodejs-hosting/
//www.smashingmagazine.com/2021/01/nodejs-api-ethereum-blockchain/