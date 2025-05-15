# Compressed Program Template

This template initializes a counter program with instructions to create a compressed account, increment the accounts counter field and delete the account.

## Build

``
$ anchor build
``

## Test

Requirements:
- light cli version 0.24.0
- solana cli version 2.1.16
- anchor version 0.31.1

1. light test-validator
2. anchor deploy
3. npm test

The `$ light test-validator` spawns a solana test validator, a prover server, and a photon indexer in the background.
In case of a connection refused error on port 3001 try to kill the prover server with `lsof -i:3001` and `kill <pid>`.


## Disclaimer

Light Protocol programs are audited and deployed on Solana devnet and mainnet.
