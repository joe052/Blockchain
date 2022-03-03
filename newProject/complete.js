//import * as crypto from 'crypto';
//const crypto = require('crypto-js');
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
  constructor(previousHash = '',transaction,date = Date.now()){
     this.previousHash = previousHash;
     this.transaction = transaction;
     //this.transaction = JSON.stringify(transaction);
     this.date = date;
     this.hash = this.calculateHash();
     this.nonce = 0; 
   }

   calculateHash(){
    return SHA256(this.previousHash + this.date + JSON.stringify(this.transaction) + this.nonce).toString();
  }

  mineBlock(difficulty){
     console.log('⛏⛏ mining...');
    while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: "+ this.hash +" and nonce is "+this.nonce);
  }
}

class Chain{
  static instance = new Chain();

  constructor(){
    //create the genesis block
    this.chain = [new Block(null,new Transaction('genesis','satoshi',500))];
    
    this.difficulty = 4;
  }

  //get last block
  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  //mine a new block
  addBlock(transaction){
    const newBlock = new Block(this.getLatestBlock().hash,transaction);
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  //get balance
  getBalanceOfAddress(address){
    let balance = 0;
    for(const block of this.chain){
      const trans = block.transaction;
      if(trans.payer === address){
        balance -= trans.amount;
      }
      if(trans.payee === address){
        balance += trans.amount;
      }
    }
    return balance;
  }

}

class Wallet{

  constructor(publicKey){
    this.publicKey = publicKey;
    this.minimum = 100;
    //this.bal = bal;
  }

  sendMoney(amount,payeePublicKey){
    let minimum = this.minimum;
    let availableBal = Chain.instance.getBalanceOfAddress(this.publicKey);
    //let availableBal = chainBal + this.bal;
    
    if(availableBal > 0 && availableBal >= amount){
      if(amount >= minimum){
        const transaction = new Transaction(this.publicKey,payeePublicKey,amount);                
       Chain.instance.addBlock(transaction);
       console.log(transaction);
      }else{
        console.log(`\nunable to initiate transaction from ${this.publicKey}...minimum transactable amount is ${minimum}`);
      }
      //console.log(Chain.instance.getBalanceOfAddress(this.publicKey) <= 0);
    }else{
      console.log("\ninsufficient funds to initiate transaction from",this.publicKey);
    }
    
  }
}

const satoshi = new Wallet('satoshi');
const bob = new Wallet('bob');
const alice = new Wallet('alice');
const amo = new Wallet('amo');

satoshi.sendMoney(200,bob.publicKey);
bob.sendMoney(15,alice.publicKey);
alice.sendMoney(100,bob.publicKey);

console.log(Chain.instance);

console.log("Balance of bob is ",Chain.instance.getBalanceOfAddress(bob.publicKey));

console.log("Balance of alice is ",Chain.instance.getBalanceOfAddress(alice.publicKey));

console.log("Balance of satoshi is ",Chain.instance.getBalanceOfAddress(satoshi.publicKey));
