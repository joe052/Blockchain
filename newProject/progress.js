//import * as crypto from 'crypto';
//const crypto = require('crypto-js');
const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(owner, receiver, size) {
    this.owner = owner;
    this.receiver = receiver;
    this.landId = this.generateId();
    this.size = size;
  }

  toString() {
    //return JSON.stringify(this);
  }

  generateId() {
    return SHA256(this.owner + this.receiver + this.size).toString();
  }
}

//container for multiple transactions
class Block {
  constructor(previousHash = '', transaction, date = Date.now()) {
    this.previousHash = previousHash;
    this.transaction = transaction;
    //this.transaction = JSON.stringify(transaction);
    this.timestamp = date;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.previousHash + this.date + JSON.stringify(this.transaction) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    console.log('⛏⛏ Transacting...');
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash + " and nonce is " + this.nonce);
  }
}

class Chain {
  static instance = new Chain();

  constructor() {
    //create the genesis block
    this.chain = [new Block(null, new Transaction('genesis', 'satoshi', 10000))];

    this.difficulty = 4;
  }

  //get last block
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  //mine a new block
  addBlock(transaction) {
    const newBlock = new Block(this.getLatestBlock().hash, transaction);
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  //get balance
  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      const trans = block.transaction;
      if (trans.owner === address) {
        balance -= trans.size;
      }
      if (trans.receiver === address) {
        balance += trans.size;
      }
    }
    return balance;
  }

}

class Wallet {

  constructor(publicKey) {
    this.publicKey = publicKey;
    this.minimum = 100;
    //this.bal = bal;
  }

  transactLand(size, receiverPublicKey) {
    let minimum = this.minimum;
    let availableLand = Chain.instance.getBalanceOfAddress(this.publicKey);

    if (availableLand > 0 && availableLand >= size) {

      if (size >= minimum) {
        const transaction = new Transaction(this.publicKey, receiverPublicKey, size);
        Chain.instance.addBlock(transaction);
        console.log(transaction);
      } else {
        console.log(`\nunable to initiate transaction from ${this.publicKey}...minimum transactable size is ${minimum}`);
      }

    } else {
      console.log("\ninsufficient land size to initiate transaction from", this.publicKey);
    }

  }
}

const satoshi = new Wallet('satoshi');
const bob = new Wallet('bob');
const alice = new Wallet('alice');
const manu = new Wallet('manu');
const joe = new Wallet('joe');
const grace = new Wallet('grace');
const ann = new Wallet('ann');
const isaac = new Wallet('isaac');
const peter = new Wallet('peter');
const agnes = new Wallet('agnes');


satoshi.transactLand(200, bob.publicKey);
satoshi.transactLand(200, manu.publicKey);
satoshi.transactLand(250, joe.publicKey);
satoshi.transactLand(300, isaac.publicKey);
//satoshi.transactLand(200, peter.publicKey);
//satoshi.transactLand(200, grace.publicKey);
//bob.transactLand(150, alice.publicKey);
//alice.transactLand(100, ann.publicKey);
//grace.transactLand(200, agnes.publicKey);

//console.log(Chain.instance.chain);
//console.log(JSON.stringify(Chain.instance,null,4));
let chain = Chain.instance.chain;

console.log(`\nSatoshi owns ${Chain.instance.getBalanceOfAddress(satoshi.publicKey)} acres of land`);
console.log(`Joe owns ${Chain.instance.getBalanceOfAddress(joe.publicKey)} acres of land`);
console.log(`Peter owns ${Chain.instance.getBalanceOfAddress(peter.publicKey)} acres of land`);
console.log(`Isaac owns ${Chain.instance.getBalanceOfAddress(isaac.publicKey)} acres of land`);
console.log(`Manu owns ${Chain.instance.getBalanceOfAddress(manu.publicKey)} acres of land`);
console.log(`Bob owns ${Chain.instance.getBalanceOfAddress(bob.publicKey)} acres of land`);
console.log(`Alice owns ${Chain.instance.getBalanceOfAddress(alice.publicKey)} acres of land`);
console.log(`Agnes owns ${Chain.instance.getBalanceOfAddress(agnes.publicKey)} acres of land`);
console.log(`Ann owns ${Chain.instance.getBalanceOfAddress(ann.publicKey)} acres of land`);
console.log(`Grace owns ${Chain.instance.getBalanceOfAddress(grace.publicKey)} acres of land`);
module.exports = chain;