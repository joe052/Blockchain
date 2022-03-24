const fetch = require('node-fetch');
const impots = require('./progress');

class Nodes {
  constructor(url, port) {
    const nodes = require("./routes.json");
    const currentURL = url + ':' + port;
    this.list = [];

    for(let i in nodes){
      if (nodes[i].indexOf(currentURL) == -1)
      this.list.push(nodes[i]);
    }
  }

  resolve(res,blockchain){
    let completed = 0;
    let nNodes = this.list.length;
    let response = [];
    let errCount = 0;

    this.list.forEach(node =>{
      fetch(node + '/blockchain',{
        headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(resp => {
        return resp.json();
      })
      //return this.returner();
      .then(respBlockchain => {
        respBlockchain = respBlockchain[0];
        console.log(respBlockchain);
        if(blockchain.length < respBlockchain.length){
        //if(Object.keys(blockchain).length < respBlockchain.length){
          impots.updateBlocks(respBlockchain);
          //response.push({synced: node,data: respBlockchain});
          response.push({synced: node});
        }else{
          //response.push({noAction: node,data: respBlockchain});
          response.push({noAction: node});
        }

        if(++completed == nNodes){
          if(errCount == nNodes){
            res.status(500);
          }
          res.send(response);
        }
      })
      .catch(error => {
        ++errCount;
        response.push({error: error.message});
        
        if(++completed == nNodes){
          if(errCount == nNodes){
            res.status(500);
          }
          res.send(response);
        }
      });
    });
  }

  //do this immediately after adding a new block
  broadcast() {
    this.list.forEach(node =>{
      fetch(node + '/resolve')//define correct route...
      .then(resp =>{
        return resp.json();
      })
      .then(resp =>{
        console.log(node, resp);
      })
      .catch(error =>{ 
        console.log(node, error);
      });
    });
  }
}

module.exports = Nodes;