// @ts-check

import * as ed from "@noble/ed25519";
import {
  NobleEd25519Signer,
  EthersEip712Signer,
  makeSignerAdd,
  FarcasterNetwork,
  getSSLHubRpcClient,
} from "@farcaster/hub-nodejs";
import { Wallet } from "ethers";
import inquirer from "inquirer";

const signerPrivateKey = ed.utils.randomPrivateKey();
const ed25519Signer = new NobleEd25519Signer(signerPrivateKey);
const signerPublicKey = await ed25519Signer.getSignerKey();

if (signerPublicKey.isErr()) {
  throw new Error(signerPublicKey.error.message);
}

// const answers = await inquirer.prompt([
//   { type: "input", message: "Enter your Farcaster hub rpc:", name: "rpc" },
//   {
//     type: "input",
//     message: "Enter your Farcaster id:",
//     name: "fid",
//   },
//   {
//     type: "input",
//     message: "Enter your Farcaster passphrase (will not be saved):",
//     name: "phrase",
//     validate: (value) => {
//       const words = value.split(" ");

//       if (words.length !== 24) {
//         return "Passphrase must contain 24 words";
//       }

//       return true;
//     },
//   },
// ]);

const wallet = Wallet.fromPhrase(
  "humble steel rent cousin flower broom canal flower trend eyebrow false since have fantasy citizen federal stem click hurry urge list police dentist stem"
);
const eip712Signer = new EthersEip712Signer(wallet);

const client = getSSLHubRpcClient("localhost:2283");

const handle = "testing";

const response = await fetch(
  `https://fnames.farcaster.xyz/transfers?name=${handle.replace("@", "")}`
);

const fid = (await response.json()).transfers[0].to;

const signerAddResult = await makeSignerAdd(
  { signer: signerPublicKey.value },
  { fid: 20804, network: FarcasterNetwork.MAINNET },
  eip712Signer
);

if (signerAddResult.isErr()) {
  throw new Error(signerAddResult.error.message);
}

const result = await client.submitMessage(signerAddResult.value);

if (result.isErr()) {
  throw new Error(result.error.message);
}

console.log(
  "A new signer was sucessfully created. Use these values in your Farcaster config when running BotSwarm. It is recommended you store your signers private key in a .env file"
);
console.log("FID: ", 20804);
console.log("Private Key", ed.etc.bytesToHex(signerPrivateKey));
