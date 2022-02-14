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
     this.transaction = transaction
     //transaction = new Transaction(payer,payee,amount);
     //Date.now() = date;
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
    this.chain = [new Block(null,new Transaction('genesis','satoshi',100))];
    //this.lastBlock = this.chain[this.chain.length - 1];
    this.difficulty = 4;
  }

  //get last block
  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  //mine a new block
  addBlock(transaction,senderPublicKey){
    const newBlock = new Block(this.getLatestBlock().hash,transaction);
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

}

class Wallet{
    
  constructor(){
    
  }

  sendMoney(amount,payeePublicKey){
    const transaction = new Transaction(this.publicKey,payeePublicKey,amount);                
    
    //const chain = new Chain();
    Chain.instance.addBlock(transaction,this.publicKey);
  }
}

const satoshi = new Wallet();
const bob = new Wallet();
const alice = new Wallet();

satoshi.sendMoney(50,bob.publicKey);
bob.sendMoney(50,alice.publicKey);
alice.sendMoney(50,bob.publicKey);

console.log(Chain.instance);
