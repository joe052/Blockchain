const impots = require('./progress.js');
const Wallet = impots.wallet;

class User{
  constructor(publicKey){
    this.publicKey = publicKey;
    //this.createUser();
  }

  createUser(){
    //let wall = new Wallet(this.publicKey);
    //wall.transactLand(800,'brooooocio');
  }

  transact(data){
    //const response = fetch('/stuff');
    //const data = response.json();
    const x = parseInt(data.size);
    const y = data.key;
    let wall = new Wallet(this.publicKey);
    wall.transactLand(x,y);
  }
}

//let user = new User('satoshi')
module.exports = User;