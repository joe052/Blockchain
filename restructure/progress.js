0//import * as crypto from 'crypto';
//const crypto = require('crypto-js');
const fetch = require('node-fetch');
const SHA256 = require('crypto-js/sha256');
const url = 'https://blockchain.joeroyalty00.repl.co';

const myUrl = "https://blockchain.joeroyalty00.repl.co/blockchain";

class Transaction {
  constructor(owner, receiver, size) {
    this.owner = owner;
    this.receiver = receiver;
    this.landId = this.generateId();
    this.size = size;
  }

  toString() {
    return JSON.stringify(this);
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

    this.chain = [];
    this.transArr = [];
    this.allAddresses = [];
    this.difficulty = 4;
  }

  /*-------------------------------complex----------------------------------------------------*/

  //get chain from api and push transaction
  async getResolve(transaction) {
    //get the chain first
    const newChain = await this.getPchain();
    console.log("recent blockchain update in use has blocks:");

    if (newChain == null || newChain.length == 0) {
      const genesis = [new Block(null, new Transaction('genesis', 'joe', 10000))];

      //adding transaction to acquired chain
      const genchain = this.addTransaction(genesis, transaction);

      //filtering transactions
      this.filterTransaction(genchain);
      //updating addresses
      this.getBalanceofAll();
    } else {
      console.log(newChain.length);

      //adding transaction to acquired chain
      const chain = this.addData(newChain, transaction);

      //filtering transactions
      this.filterTransaction(chain);
      //updating addresses
      this.getBalanceofAll();
    }
  }


  //cleaning
  addArray(object) {
    let newChain = [];
    newChain.push(object);
    newChain = newChain[0];
    return newChain;
  }

  /*-------------------------end of complex----------------------------------------------------*/

  //push new block with transaction to chain
  addData(object, transaction) {
    let setup = [];
    setup.push(object);

    //picking chain elements only #filtering
    setup = setup[0];
    //setup = setup[0];

    console.log("This is the chain i fetched:");
    //console.log(setup);

    //checking length of fetched chain
    console.log(setup.length);

    //getting latest block of chain
    const latest = setup[Object.keys(setup).length - 1];
    //console.log("\nbelow lies the latest")
    //console.log(latest.hash);

    //creating and mining new block and adding transaction
    const newBlock = new Block(latest.hash, transaction);
    newBlock.mineBlock(this.difficulty);
    console.log(transaction);
    setup.push(newBlock);
    //console.log(setup);
    //console.log(Object.keys(setup).length);
    console.log(`setups length is ${setup.length}`);

    //pushing update to blockchain
    if (Array.isArray(this.chain)) {

      //emptying previous array
      while (this.chain.length) {
        this.chain.pop();
      }

      //pushing new array
      for (const x in setup) {
        const data = setup[x];
        this.chain.push(data);
      }
    }

    //console.log(this.chain); 
    console.log(`blockchains length is ${this.chain.length}`);
    console.log("\nupdate successfully complete!!");
    return this.chain;
  }

  //push new block to genesis incase no chain is available
  addTransaction(genesis, transaction) {
    let setup = [];
    setup.push(genesis);

    //picking chain elements only #filtering
    setup = setup[0];

    //creating and mining new block and adding transaction
    const newBlock = new Block(this.getLatestBlock2(setup).hash, transaction);
    newBlock.mineBlock(this.difficulty);
    console.log(transaction);
    setup.push(newBlock);
    //console.log(setup);
    console.log(`setups length is ${setup.length}`);

    //pushing update to blockchain
    this.chain.push(setup);
    this.chain = this.chain[0];
    console.log(`blockchain's length is ${this.chain.length}`);
    console.log("\nupdate successfully complete!!");
    return this.chain;
  }

  /*----------------test to get the pure chain only------------------------------------------------*/

  //get chain
  async getPchain() {
    const response = await fetch(url + '/resolve');
    const result = await response.json();
    //let bigChain = [];
    //shared method addArray() in complex section
    let allChain = this.addArray(result);
    console.log("available chains are:");
    console.log(allChain.length);
    allChain.sort();
    const newChain = allChain[allChain.length - 1];
    //console.log(newChain);
    //console.log(newChain.length);
    return newChain;
  }

  returner() {
    //console.log("returning");
    return this.getPchain();
  }
  /*-----------------------end of test---------------------------------------------*/

  //get last block
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  getLatestBlock2(array) {
    return array[array.length - 1];
  }

  //filter transactions only from chain
  filterTransaction(chain) {
    const arrTrans = [];
    //const chain = await this.returner();
    for (const block of chain) {
      const trans = block.transaction;
      arrTrans.push(trans);
    }
    //const update = arrTrans[arrTrans.length - 1];

    //emptying previous array
    while (this.transArr.length) {
      this.transArr.pop();
    }

    //pushing new array
    for (const x in arrTrans) {
      const data = arrTrans[x];
      this.transArr.push(data);
    }

    console.log(`transactions are ${this.transArr.length}`);
    return this.transArr;
  }

  //get balance
  async getBalanceOfAddress(address) {
    let balance = 0;
    const chain = await this.returner();
    //console.log(chain);

    for (const block of chain) {
      const trans = block.transaction;
      if (trans.owner === address) {
        balance -= trans.size;
      }
      if (trans.receiver === address) {
        balance += trans.size;
      }
    }
    return balance;
    //console.log(balance);
  }

  // get the balance of all
  async getBalanceofAll(){
    const chain = await this.returner();
    let addressesArr = [];
    let addressesArr2 = [];
    let result = [];
    
    for (const block of chain) {
      const trans = block.transaction;
      addressesArr.push(trans.owner);
      addressesArr.push(trans.receiver);
    }

    //remove all duplicates     
    addressesArr2 = addressesArr.filter((item,
    index) => addressesArr.indexOf(item) === index);  

    for(const x of addressesArr2){
      const balance = await this.getBalanceOfAddress(x);
      const obj = {address: x, balance: balance};
      result.push(obj);
    }

    //emptying previous array
    while (this.allAddresses.length) {
      this.allAddresses.pop();
    }

    //pushing new array
    for (const x in result) {
      const data = result[x];
      this.allAddresses.push(data);
    }   
    return result;    
  }

  async chainUpdate() {
    //get the chain first
    const newChain = await this.getPchain();
    console.log("recent blockchain update in use has blocks:");
    console.log(newChain.length);

    //adding transaction to acquired chain
    //const chain = this.addData(newChain,transaction);
    let setup = [];
    setup.push(newChain);
    //picking chain elements only #filtering
    setup = setup[0];
    //setup = setup[0];
    console.log("This is the chain i fetched:");
    //console.log(setup);

    //checking length of fetched chain
    console.log(setup.length);

    //pushing update to blockchain
    if (Array.isArray(this.chain)) {

      //emptying previous array
      while (this.chain.length) {
        this.chain.pop();
      }

      //pushing new array
      for (const x in setup) {
        const data = setup[x];
        //arr.push(data);
        this.chain.push(data);
      }
      //this.chain.push(arr);
    }

    //console.log(this.chain); 
    console.log(`blockchain updated...new length is ${this.chain.length}`);

    //filtering transactions
    this.filterTransaction(this.chain);
    //updating addresses
      this.getBalanceofAll();

    return this.chain;
  }

}

class Wallet {
  constructor(publicKey) {
    this.publicKey = publicKey;
    this.minimum = 100;
    //this.balance = this.getBalance();
  }

  async chainUpdate() {
    Chain.instance.chainUpdate();
  }

  async getBalance() {
    //check if chain is available
    const newChain = await Chain.instance.getPchain();

    let availableLand;
    if (newChain == null || newChain.length == 0) {
      availableLand = 10000;
    } else {
      availableLand = await Chain.instance.getBalanceOfAddress(this.publicKey);
    }
    return availableLand;
  }

  async transactLand(size, receiverPublicKey, res) {
    let availableLand = await this.getBalance();
    let minimum = this.minimum;
    let newBalance = availableLand - size;

    //define response
    let response;
    if (availableLand > 0 && availableLand >= size) {
      if (size >= minimum) {
        const transaction = new Transaction(this.publicKey, receiverPublicKey, size);
        //Chain.instance.getChain(transaction);
        Chain.instance.getResolve(transaction);
        response = `\nTransaction of land size ${size} to ${receiverPublicKey} completed successfuly your new balance is  ${newBalance}`;
      } else {
        response = `\nunable to initiate transaction from ${this.publicKey}...minimum transactable size is ${minimum}`;
        console.log(response);
      }

    } else {
      response = `\ninsufficient land size to initiate transaction from ${this.publicKey} available balance is ${availableLand}`;
      console.log(response);
    }
    res.send({ message: response });
  }
}

let chain = Chain.instance.chain;
let transArr = Chain.instance.transArr;
let addresses = Chain.instance.allAddresses;


module.exports = {
  chain: chain,
  updateBlocks: blocks => { chain = blocks; },
  transactions: transArr,
  addresses: addresses,
  wallet: Wallet,
  mega: Chain
}