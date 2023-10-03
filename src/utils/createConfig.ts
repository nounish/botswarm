import {
  Abi,
  Address,
  HttpTransport,
  PrivateKeyAccount,
  PublicClient,
  WalletClient,
  createPublicClient,
  createWalletClient,
  http,
  Chain as _Chain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as chains from "viem/chains";
import { Wallet as EthersWallet } from "ethers";
import type _ from "viem/node_modules/abitype";
import env from "dotenv";
import { MerkleAPIClient } from "@standard-crypto/farcaster-js";
env.config();

export type Chain = keyof typeof chains;

export type Contract = {
  readonly abi: Abi;
  readonly deployments: {
    [TChain in Chain]?: Address;
  };
};

export type Client = PublicClient<HttpTransport, (typeof chains)[Chain]>;

export type Wallet = WalletClient<
  HttpTransport,
  (typeof chains)[Chain],
  PrivateKeyAccount
>;

export type FarcasterAccount = EthersWallet | undefined;

export type FarcasterClient = MerkleAPIClient | undefined;

export type RPCs = { [TChain in Chain]?: string };

export default function createConfig<
  TContracts extends Record<string, Contract>
>(contracts: TContracts, rpcs: RPCs) {
  let clients: Record<string, Client> = {};
  let wallets: Record<string, Wallet> = {};

  for (const contract in contracts) {
    for (const deployment in contracts[contract].deployments) {
      const rpc = rpcs[deployment as Chain];

      clients[deployment] = createPublicClient({
        transport: http(rpc),
        chain: chains[deployment as Chain],
      });

      if (!process.env.ETHEREUM_PRIVATE_KEY) {
        throw new Error(
          "ETHEREUM_PRIVATE_KEY environment variable is required to run BotSwarm, see: https://github.com/nounish/botswarm/tree/main#configuration"
        );
      }

      wallets[deployment] = createWalletClient({
        account: privateKeyToAccount(
          process.env.ETHEREUM_PRIVATE_KEY as Address
        ),
        chain: chains[deployment as Chain],
        transport: http(rpc),
      });
    }
  }

  let farcasterAccount: FarcasterAccount;
  let farcasterClient: FarcasterClient;

  if (process.env.FARCASTER_PHRASE) {
    farcasterAccount = EthersWallet.fromMnemonic(process.env.FARCASTER_PHRASE);
    farcasterClient = new MerkleAPIClient(farcasterAccount);
  }

  return {
    clients,
    wallets,
    farcasterAccount,
    farcasterClient,
  };
}
