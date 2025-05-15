# Compressed Program Template

This template initializes a counter program with instructions to create a compressed account, increment the accounts counter field and delete the account.

## Build

``
$ anchor build
``

## Test

Requirements:
- light cli

1. light test-validator
2. anchor deploy // check that program id matches deployed id
3. export ANCHOR_PROVIDER_URL="http://127.0.0.1:8899"
4. export ANCHOR_WALLET="target/deploy/test_123-keypair.json"
5. npm test

The test spawns a prover server in the background.
In case of a connection refused error on port 3001 try to kill the prover server with `lsof -i:3001` and `kill <pid>`.


## Disclaimer

Programs are audited and deployed on Solana devnet and mainnet.
The light rust macros are experimental and api will change.
