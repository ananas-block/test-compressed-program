import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { Test123 } from "../target/types/test_123";
import {
  bn,
  createRpc,
  defaultStaticAccountsStruct,
  defaultTestStateTreeAccounts,
  deriveAddress,
  deriveAddressSeed,
  getConnection,
  getTestRpc,
  Rpc,
} from "@lightprotocol/stateless.js";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { WasmFactory } from "@lightprotocol/hasher.rs";

describe("test-anchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Test123 as Program<Test123>;

  it("", async () => {
    let signer = new web3.Keypair();
    const lightWasm = await WasmFactory.getInstance();
    const rpc = await getTestRpc(lightWasm);
    // let rpc = createRpc(
    //   "http://127.0.0.1:8899",
    //   "http://127.0.0.1:8784",
    //   "http://127.0.0.1:3001"
    // );
    let lamports = web3.LAMPORTS_PER_SOL;
    await rpc.requestAirdrop(signer.publicKey, lamports);

    const outputMerkleTree = defaultTestStateTreeAccounts().merkleTree;
    const addressTree = defaultTestStateTreeAccounts().addressTree;
    const addressQueue = defaultTestStateTreeAccounts().addressQueue;
    const counterSeed = new TextEncoder().encode("counter");
    const seed = deriveAddressSeed(
      [counterSeed, signer.publicKey.toBytes()],
      new web3.PublicKey(program.idl.address)
    );
    const address = deriveAddress(seed, addressTree);

    const proof = await rpc.getValidityProofV0(
      [],
      [
        // bn(address.toBytes()),
        {
          tree: addressTree,
          queue: addressQueue,
          address: bn(address.toBytes()),
        },
      ]
    );
    const packedAddreesMerkleContext = {
      root_index: proof.rootIndices[0],
      address_merkle_tree_pubkey_index: 0,
      address_queue_pubkey_index: 1,
    };
    const output_merkle_tree_index = 2;

    const tx = await program.methods
      .create(
        proof.compressedProof,
        packedAddreesMerkleContext,
        output_merkle_tree_index
      )
      .accounts({
        signer: signer.publicKey,
        ...defaultStaticAccountsStruct(),
      })
      .remainingAccounts([
        {
          pubkey: addressQueue,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: addressTree,
          isWritable: true,
          isSigner: false,
        },
        {
          pubkey: outputMerkleTree,
          isWritable: true,
          isSigner: false,
        },
      ])
      .rpc();
    console.log("Your transaction signature", tx);
  });
});
