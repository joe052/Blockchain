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
    this.miningReward = 100;
    this.previousHash = this.getLatestBlock().hash;
  }

  createGenesisBlock(){
    return new Block('01/01/2022','Genesis Block')
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress){
    let block = new Block(Date.now(),this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block successfully mined!")
    
    //reset the pending transactions array & create new transaction to reward miner
    this.pendingTransactions = [new Transaction(null,miningRewardAddress,this.miningReward)];
    //this.createTransaction(new Transaction(null,miningRewardAddress,this.miningReward));

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
console.log(JSON.stringify(coin,null,4));

//console.log('\nBalance of joe is ', coin.getBalanceOfAddress('joe'));
//console.log('\nBalance of peter is ', coin.getBalanceOfAddress('peter'));






//import * as crypto from 'crypto';
const crypto = require('crypto-js');
const SHA256 = require('crypto-js/sha256');

class Transaction{
  constructor(payer,payee,amount){
    this.payer = payer;
    this.payee = payee;
    this.amount = amount;
  }

  toString(){
    return JSON.stringify(this);
  }
}

//container for multiple transactions
class Block{
 //nonce = Math.round(Math.random() * 999999999);
  
   constructor(previousHash = '',transaction,date){
     this.previousHash = previousHash;
     transaction = new Transaction(payer,payee,amount);
     Date.now() = date;
   }

   getHash(){
     const str = JSON.stringify(this);
     const hash = crypto.createHash('SHA256');
     hash.update(str).end();
     return hash.digest('hex');
   }
}

class Chain{
  
  lastBlock = this.chain[this.chain.length - 1];

  constructor(){
    //create the genesis block
    this.chain = [new Block(null,new 
    Transaction('genesis','satoshi',100))];
    
  }

  //get last block
  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  //mine a new block
  mine(nonce){
    let solution = 1;
    console.log("⛏⛏ mining...");

    while(true){
     // const hash = crypto.createHash('MD5');
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest('hex');
      if(attempt.substr(0,4) === '0000'){
        console.log(`solved: ${solution}`);
        return solution;
      }
      solution += 1;
    }
  }

  addBlock(transaction,senderPublicKey,signature){
    const newBlock = new Block(this.lastBlock.hash,transaction);
    this.chain.push(newBlock);
    const verifier = crypto.createVerify('SHA256');
    verifier.update(transaction.toString());
    const isValid = verifier.verify(senderPublicKey,signature);

    if(isValid){
      const newBlock = new Block(this.lastBlock.hash,transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    }
  }
}

class Wallet{
  //privateKey;
  //publicKey;
  
  constructor(){
    const keypair = crypto.generateKeyPairSync('rsa',{
      modulusLength: 2048,
      publicKeyEncoding: {type: 'spki',format: 'pem'},
      privateKeyEncoding: {type: 'pkcs8',format: 'pem'},
    });
    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }

  sendMoney(amount,payeePublicKey){
    const transaction = new Transaction(this.publicKey,payeePublicKey,amount);                
    const sign = crypto.createSign('SHA256');
    sign.update(transaction.toString()).end();

    const signature = sign.sign(this.privateKey);
    const signature = 'approved';


    const chain = new Chain();
    chain.addBlock(transaction,this.publicKey,signature);
    //Chain.instance.addBlock(transaction,this.publicKey,signature);
  }
}

const satoshi = new Wallet();
const bob = new Wallet();
const alice = new Wallet();

satoshi.sendMoney(50,bob.publicKey);
bob.sendMoney(50,alice.publicKey);
alice.sendMoney(50,bob.publicKey);

//console.log(Chain.instance);


