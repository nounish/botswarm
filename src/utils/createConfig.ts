import {
  Address,
  Chain,
  createPublicClient,
  createWalletClient,
  getContract,
  http,
  parseAbi,
  parseAbiItem,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

// import env from "dotenv";
// env.config();

type Contract = {
  name: string;
  abi: string[];
  deployments: Array<{
    chain: Chain;
    address: Address;
  }>;
};

export default function createConfig<T extends readonly Contract[]>(
  contracts: T
) {
  return contracts;
}

//   let clients: Record<string, ReturnType<typeof createPublicClient>> = {};
//   let wallets: Record<string, ReturnType<typeof createWalletClient>> = {};

//   // Create clients and wallets for each chain
//   for (const contract of contracts) {
//     for (const deployment of contract.deployments) {
//       clients[deployment.chain.network] = createPublicClient({
//         chain: deployment.chain,
//         transport: http(),
//       });
//       wallets[deployment.chain.network] = createWalletClient({
//         account: privateKeyToAccount(process.env.PRIVATE_KEY as Address),
//         chain: deployment.chain,
//         transport: http(),
//       });
//     }
//   }

//   let contractInstances: Record<
//     string,
//     {
//       [K in (typeof contracts)[number]["name"]]: ReturnType<typeof getContract>;
//     }
//   > = {};

//   type test = {
//     [K in (typeof contracts)[number]["name"]]: boolean;
//   };

//   for (const contract of contracts) {
//     for (const deployment of contract.deployments) {
//       contractInstances[contract.name][deployment.chain.network] = getContract({
//         address: deployment.address,
//         abi: contract.abi.map((abi) => parseAbiItem(abi)),
//         publicClient: clients[deployment.chain.network],
//         walletClient: wallets[deployment.chain.network],
//       });
//     }
//   }
//
//   return {
//     clients,
//     wallets,
//     contracts: contractInstances,
//   };

// }
