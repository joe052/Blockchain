const fetch = require('node-fetch');
const impots = require('./progress.js');

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
      fetch(node + '/blockchain')
      .then(resp => {
        return resp.json();
      })
      .then(respBlockchain => {
        if(blockchain.blocks.length < respBlockchain.length){
          blockchain.updateBlocks(respBlockchain);
          response.push({synced: node});
        }else{
          response.push({noAction: node});
        }

        if(++completed = nNodes){
          if(errCount == nNodes){
            res.status(500);
          }
          res.send(response);
        }
      })
      .catch(error => {
        ++errCount;
        response.push({error: error.message});
        
        if(++completed = nNodes){
          if(errCount == nNodes){
            res.status(500);
          }
          res.send(response);
        }
      });
    });
  }

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