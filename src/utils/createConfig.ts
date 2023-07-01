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
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import chains from "viem/chains";

export type Chain = keyof typeof chains;

export type Contract = {
  readonly abi: Abi;
  readonly deployments: {
    readonly [TChain in Chain]?: Address;
  };
};

export type Client = PublicClient<HttpTransport, (typeof chains)[Chain]>;

export type Wallet = WalletClient<
  HttpTransport,
  (typeof chains)[Chain],
  PrivateKeyAccount
>;

export default function createConfig<
  TContracts extends Record<string, Contract>
>(contracts: TContracts) {
  let clients = {} as Record<string, Client>;
  let wallets = {} as Record<string, Wallet>;

  for (const contract in contracts) {
    for (const deployment in contracts[contract].deployments) {
      clients[deployment] = createPublicClient({
        transport: http(),
        chain: chains[deployment as Chain],
      });

      if (!process.env.PRIVATE_KEY) {
        throw new Error(
          "PRIVATE_KEY environment variable is required to run BotSwarm, see: https://github.com/nounish/botswarm/tree/main#configuration"
        );
      }

      wallets[deployment] = createWalletClient({
        account: privateKeyToAccount(process.env.PRIVATE_KEY as Address),
        chain: chains[deployment as Chain],
        transport: http(),
      });
    }
  }

  return { clients, wallets, contracts };
}
