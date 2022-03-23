const fetch = require('node-fetch');
const impots = require('./progress.js');

class Nodes {
  constructor(url, port) {
    const nodes = require("");
    const currentURL = url + ':' + port;
    this.list = [];

    for(let i in nodes){
      if (nodes[i].indexOf(currentURL) == -1)
      this.list.push(nodes[i]);
    }
  }
}