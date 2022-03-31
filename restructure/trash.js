resolve(res, blockchain) {
  let completed = 0;
  let nNodes = this.list.length;
  let response = [];
  let errorCount = 0;

  this.list.forEach(function(node) {
    fetch(node + '/blockchain')
    .then(function(resp) {
    return resp.json();
    })
    .then(function(respBlockchain) {
      if (blockchain.blocks.length < respBlockchain.length) {
        blockchain.updateBlocks(respBlockchain);
        response.push({synced: node});
      } else {
       response.push({noaction: node});
      }
                    
      if (++completed == nNodes) {
        if (errorCount == nNodes)
          res.status(500);
        res.send(response);
      }
    })
    .catch(function(error) { 
      ++errorCount;
      //response.push({error: 'Failed to reach node at ' + node})
      response.push({error: error.message})
        if (++completed == nNodes) {
          if (errorCount == nNodes)
            res.status(500);
          res.send(response);
        }
    });
  });
}



//get chain from api and push transaction
  async getResolve2(node,transaction){
    const response = await fetch(node + '/resolve');
    const result = await response.json();
    //let bigChain = [];
      //shared method addArray() in complex section
    let allChain = this.addArray(result);
    
    if(allChain.length == 0){
      const genesis = [new Block(null, new Transaction('genesis', 'satoshi', 10000))];
      
      //adding transaction to acquired chain
      this.addTransaction(genesis,transaction);
    }else{
      console.log(allChain.length);
      allChain.sort();
      const newChain = allChain[allChain.length - 1];
      //console.log(newChain);
      console.log(newChain.length);

      //adding transaction to acquired chain
      this.addData(newChain,transaction);
    
      for(const i of allChain){
        //console.log(i.length);
      }  
    }
  }