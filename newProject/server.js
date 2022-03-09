const chain = require("./progress.js");
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser');

const courses = [
  {id: 1, name: 'maths'},
  {id: 2, name: 'science'},
  {id: 3, name: 'education'}
];

app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));
app.use(express.json());

app.use(express.static('newProject'));
app.listen(port,()=>{
  console.log(`app listening on port ${port}`);
});

app.post('/data',(req,res)=>{
  console.log(req.body);
});

app.get('/',(req,res)=>{
  res.send('Hello world');
});

app.get('/api/courses',(req,res)=>{
  res.send(courses);
});

app.get('/api/courses/:id',(req,res)=>{
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if(!course) res.status(404).send('files not found!');
  res.send(course);
});

app.post('/api/courses',(req,res)=>{
  const course = {
    id: courses.length +1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
  console.log(courses);
});

async getChain(transaction) {
    const response = await fetch(myUrl);
    const data = await response.json();
    console.log("getting...");
    this.addData(data,transaction);
  }

  //push new block with transaction to chain
  addData(object,transaction) {
    this.chain.push(object);
    
    //picking chain elements only #filtering
    this.chain = this.chain[0];
    console.log("This is the chain i fetched:")
    //console.log(this.chain);

    //special .length for objects...checking length of fetched chain
    console.log(Object.keys(this.chain).length);

    //getting latest block of chain
    const latest = this.chain[Object.keys(this.chain).length -1];
    //console.log("\nbelow lies the latest")
    //console.log(latest.hash);

    //creating and mining new block and adding transaction
    const newBlock = new Block(latest.hash, transaction);
    newBlock.mineBlock(this.difficulty);
    console.log(transaction);
    this.chain.push(newBlock);
    console.log(this.chain);
    console.log(Object.keys(this.chain).length);
    console.log("\nupdate successfully complete!!")
  }


app.get('/blockchain',(req,res)=>{
  res.send(chain);
});
console.log(chain);

//https://geshan.com.np/blog/2021/01/free-nodejs-hosting/