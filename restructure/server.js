
// import{chain} from ('./progress.js');
// import{express} from ('express');
// import{bodyParser} from ('body-parser');
// import{fetch} from ('node-fetch');

let impots = require("./progress.js");
const User = require("./user.js");
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const Nodes = require('./nodes.js');
const Chain = impots.mega;

//creating user
let user = new User('joe');

console.log(impots.chain);

// Load env vars
const url = process.env.URL || '0.0.0.0';

const myUrl1 = 'https://blockchain.michomapeter.repl.co/blockchain';
const myUrl = 'https://client-blockchain.joeroyalty00.repl.co';

app.use(bodyParser.urlencoded({ limit: '5000mb', extended: true, parameterLimit: 100000000000 }));
app.use(express.json());

app.use(express.static('restructure'));

let nodes = new Nodes(url, port);
let chain = new Chain();

//method to refresh blockchain at a specified interval
setInterval(() => {
  user.update();
}, 10000);

//testing my server with postman
app.post('/data', (req, res) => {
  console.log(req.body);
});

app.get('/', (req, res) => {
  res.send('Build on progress... @Master');
});

let chainM = [];

/*local chain accessible here*/
app.get('/blockchain', (req, res) => {
  if (impots.chain.length == 1) {
    res.send(impots.chain[0]);
  } else {
    res.send(impots.chain);
  }
});

app.get('/blockchains', (req, res) => {
  //chain.chainSender(res);
});

app.get('/transactions', (req, res) => {
  //const transactions = chain.filterTransaction(impots.chain);
  res.send(impots.transactions);
});

/*all chains accessible here*/
app.get('/resolve', (req, res) => {
  nodes.resolve(res, impots.chain);
});

/*chain statuses accessible here*/
app.get('/allNodes', (req, res) => {
  nodes.allNodes(res);
});

/*used to send the balance*/
app.get('/balance', (req, res) => {
  //get balance first
  user.getBalance().then((balance) => {
    res.send({ balance: balance });
  });
});

/*used to send all addresse balances*/
app.get('/allbalances', (req, res) => {
  res.send(impots.addresses);
});

/*used by front end form*/
app.post('/stuff', (req, res) => {
  console.log('receiving request');
  console.log(req.body);
  const data = req.body;
  user.transact(data, res);
  //return res.redirect("index.html");
});

//console.log(impots.chain);
//nodes.broadcast();
//impots.teest(myUrl);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

//https://geshan.com.np/blog/2021/01/free-nodejs-hosting/
//www.smashingmagazine.com/2021/01/nodejs-api-ethereum-blockchain/