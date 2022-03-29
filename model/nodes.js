const fetch = require('node-fetch');
const impots = require('./progress.js');

class Nodes {
  constructor(url, port) {
    const nodes = require("./routes.json");
    const currentURL = url + ':' + port;
    this.list = [];
    this.response = [];

    for(let i in nodes){
      if (nodes[i].indexOf(currentURL) == -1)
      this.list.push(nodes[i]);
    }
  }

  resolve(res,blockchain){
    let completed = 0;
    let nNodes = this.list.length;
    let data = [];
    let main = [];
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
      .then(respBlockchain => {
        //console.log(respBlockchain.length);
        //console.log(blockchain.length);
        if(blockchain.length < respBlockchain.length){
          impots.updateBlocks(respBlockchain);
          //response.push({synced: node,data: respBlockchain});
          this.response.push({synced: node});
          data.push(respBlockchain);
        }else{
          //response.push({noAction: node,data: respBlockchain});
          this.response.push({noAction: node});
          data.push(respBlockchain);
        }

        if(++completed == nNodes){
          if(errCount == nNodes){
            res.status(500);
          }
          res.send(data);
        }
      })
      .catch(error => {
        ++errCount;
        this.response.push({error: error.message});
        
        if(++completed == nNodes){
          if(errCount == nNodes){
            res.status(500);
          }
          res.send(data);
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

  allNodes(res){
    res.send(this.response);
  }
}

module.exports = Nodes;