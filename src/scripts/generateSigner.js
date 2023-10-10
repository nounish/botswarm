#!/usr/bin/env node

//@ts-check

import * as ed from "@noble/ed25519";
import { mnemonicToAccount } from "viem/accounts";
import qrcode from "qrcode-terminal";
import inquirer from "inquirer";
import colors from "kleur";
import dotenv from "dotenv";
dotenv.config();

/*** Get user input ***/
const answers = await inquirer.prompt([
  {
    type: "input",
    message: "Enter your Farcaster username:",
    name: "username",
  },
  {
    type: "input",
    message: "Enter your Farcaster passphrase (will not be saved):",
    name: "phrase",
    validate: (value) => {
      const words = value.split(" ");

      if (words.length !== 24) {
        return "Passphrase must contain 24 words";
      }

      return true;
    },
  },
]);

/*** EIP-712 helper code ***/

const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator",
  version: "1",
  chainId: 10,
  verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553",
};

const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
];

/*** Generating a keypair ***/

const privateKey = ed.utils.randomPrivateKey();
const publicKeyBytes = await ed.getPublicKeyAsync(privateKey);
const key = "0x" + Buffer.from(publicKeyBytes).toString("hex");

/*** Get FID from handle ***/
const request = await fetch(
  `https://api.warpcast.com/v2/user-by-username?username=${answers.username.replace(
    "@",
    ""
  )}`
);

const response = await request.json();

const fid = response.result.user.fid;

/*** Generating a Signed Key Request signature ***/

const account = mnemonicToAccount(answers.phrase);

const oneYear = 60 * 60 * 24 * 365;

const deadline = Math.floor(Date.now() / 1000) + oneYear;
const signature = await account.signTypedData({
  // @ts-ignore
  domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
  types: {
    SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
  },
  primaryType: "SignedKeyRequest",
  message: {
    requestFid: BigInt(fid),
    key,
    deadline: BigInt(deadline),
  },
});

/*** Broadcasting message in app ***/

const data = await fetch("https://api.warpcast.com/v2/signed-key-requests", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    key,
    requestFid: fid,
    signature,
    deadline,
  }),
}).then((response) => response.json());

const deeplinkUrl = data.result.signedKeyRequest.deeplinkUrl;
const url = deeplinkUrl.replace(
  "farcaster://",
  "https://client.warpcast.com/deeplinks/"
);

qrcode.generate(url, { small: true });

console.log(
  "Once you've signed into this account on Warpcast, scan the QR code on a mobile device."
);
console.log(
  "\nFollow the instuctions in the app and once the process is complete you can use the following in your Farcaster config."
);
console.log(
  "\nIt is recommended you store the signerPrivateKey in a safe place."
);

console.log(`\n${colors.bgBlue(colors.bold(" fid "))}: ${colors.blue(fid)}`);
console.log(
  `${colors.bgMagenta(colors.bold(" signerPrivateKey "))}: ${colors.magenta(
    ed.etc.bytesToHex(privateKey)
  )}\n`
);
