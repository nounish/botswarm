import * as ed from "@noble/ed25519";
import {
  NobleEd25519Signer,
  EthersEip712Signer,
  makeSignerAdd,
  FarcasterNetwork,
  getSSLHubRpcClient,
} from "@farcaster/hub-nodejs";
import { Wallet } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const signerPrivateKey = ed.utils.randomPrivateKey();
const ed25519Signer = new NobleEd25519Signer(signerPrivateKey);
const signerPublicKey = await ed25519Signer.getSignerKey();

if (signerPublicKey.isErr()) {
  throw new Error(signerPublicKey.error.message);
}

const wallet = Wallet.fromPhrase(process.env.TEST_FARCASTER_PHRASE);

const eip712Signer = new EthersEip712Signer(wallet);

const client = getSSLHubRpcClient(process.env.TEST_FARCASTER_HUB);

const signerAddResult = await makeSignerAdd(
  { signer: signerPublicKey.value },
  {
    fid: Number(process.env.TEST_FARCASTER_FID),
    network: FarcasterNetwork.MAINNET,
  },
  eip712Signer
);

if (signerAddResult.isErr()) {
  throw new Error(signerAddResult.error.message);
}

const submitMessage = await client.submitMessage(signerAddResult.value);

if (submitMessage.isErr()) {
  throw new Error(submitMessage.error.message);
}

console.log(
  "A new signer was sucessfully created. Use these values in your Farcaster config when running BotSwarm. It is recommended you store your signers private key in a .env file"
);
console.log("FID: ", process.env.TEST_FARCASTER_FID);
console.log("Private Key", ed.etc.bytesToHex(signerPrivateKey));
