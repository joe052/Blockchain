let chain = require("./progress.js");
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const myUrl1 = 'https://blockchain.michomapeter.repl.co/blockchain';
const myUrl = 'https://client-blockchain.joeroyalty00.repl.co/blockchain';

const courses = [
  { id: 1, name: 'maths' },
  { id: 2, name: 'science' },
  { id: 3, name: 'education' }
];

app.use(bodyParser.urlencoded({ limit: '5000mb', extended: true, parameterLimit: 100000000000 }));
app.use(express.json());

app.use(express.static('newProject'));
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

app.post('/data', (req, res) => {
  console.log(req.body);
});

app.get('/', (req, res) => {
  res.send('Hello world @Joe');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) res.status(404).send('files not found!');
  res.send(course);
});

app.post('/api/courses', (req, res) => {
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
  console.log(courses);
});

let chainM = [];

async function getChain() {
  const response = await fetch(myUrl);
  const data = await response.json();
  console.log("\ngetting...");
  const chain = addData(data);
  return chain;
}

//push new block with transaction to chain
function addData(object) {
  chainM.push(object);

  //picking chain elements only #filtering
  chainM = chainM[0];
  console.log("This is the chain i fetched:")
  //console.log(chainM);

  //special .length for objects...checking length of fetched chain
  console.log(Object.keys(chainM).length);

  //getting latest block of chain
  const latest = chainM[Object.keys(chainM).length - 1];
  //console.log("\nbelow lies the latest")
  //console.log(latest.hash);
  return chainM;
}
async function getter() {
  if (getChain()) {
    chain = await getChain();
  }else{
    chain;
  }
}

//getter();
app.get('/blockchain', (req, res) => {
  res.send(chain);
});
//getChain();
console.log(chain);

//https://geshan.com.np/blog/2021/01/free-nodejs-hosting/
//www.smashingmagazine.com/2021/01/nodejs-api-ethereum-blockchain/