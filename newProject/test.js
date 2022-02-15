const SHA256 = require('crypto-js/sha256');

class Transaction{
  constructor(fromAdress,toAdress,amount){
    this.fromAddress = fromAdress;
    this.toAdress = toAdress;
    this.amount = amount;
  }
}

class Block{
  constructor(timestamp,transactions,previousHash=''){
    this.timestamp = timestamp;
    this.transactions = transactions;
    //this.transactions = JSON.stringify(transactions);
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0; 
  } 

  calculateHash(){
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty){
    while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: "+ this.hash +" and nonce is "+this.nonce);
  }
}

class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    //this.miningReward = 100;
    //this.previousHash = this.getLatestBlock().hash;
  }

  createGenesisBlock(){
    return new Block('01/01/2022','Genesis Block',null)
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress){
    let block = new Block(Date.now(),this.pendingTransactions,this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!")
    
    //reset the pending transactions array & create new transaction to reward miner
    //this.pendingTransactions = [new Transaction(null,miningRewardAddress,this.miningReward)];

    //add to chain
    this.chain.push(block);
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address){
    let balance = 0;
    for(const block of this.chain){
      for(const trans of block.transactions){
        if(trans.fromAddress === address){
          balance -= trans.amount;
        }
        if(trans.toAddress === address){
          balance += trans.amount;
        }
      }
    }
    return balance;
  }
  
  isChainValid(){
    for(let i = 1;i < this.chain.length - 1; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      if(currentBlock.previousHash !== previousBlock.hash){
        return false;
      }
      
    } 
    return true;
  }
}

let coin = new Blockchain();
coin.createTransaction(new Transaction('peter','joe',100));
coin.createTransaction(new Transaction('joe','peter',20));

console.log("\nStarting the miner...");
coin.minePendingTransactions('joe');

console.log("\nStarting the miner again...");
coin.minePendingTransactions('joe');

console.log(coin);

console.log('\nBalance of joe is ', coin.getBalanceOfAddress('joe'));
console.log('\nBalance of peter is ', coin.getBalanceOfAddress('peter'));