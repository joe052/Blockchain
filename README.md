# Land Verification Server

This repository contains the code for a land verification platform that utilizes blockchain technology to securely and transparently track the ownership of land. Its a rest api server to access the blockchain and expose it into API endpoints.

## Features
1. Uses a decentralized blockchain network made up of nodes representing land owners
2. Immutable, tamper-proof ledger of land transactions
3. Verifiable history of land ownership

## Getting Started
To get started with this project, clone the repository and install the dependencies:

```
git clone https://github.com/joe052/Blockchain.git
cd Blockchain
npm install
```

## API Documentation
The Land Verification Platform API allows you to interact with the platform's blockchain network to add and verify land transactions.

### Endpoints

#### `Clients API`
| Endpoints | Description |
|-----------|-------------|
|`GET /blockchains` | Returns whole blockchain data |
|`GET /transactions` | Returns all transactions in blockchain |
|`GET /allNodes` | Returns all active nodes |

#### `Nodes API`
| Endpoints | Description |
|-----------|-------------|
|`GET /balance` | Returns nodes user balance |
|`POST /transact` | Enable the node user to transact |

## Contribution
You are free to contribute to this project as long as you follow community contributing guidelines.

# License
This project is licensed under the MIT License - see the LICENSE file for details.