import {
  Address,
  createPublicClient,
  createWalletClient,
  getContract,
  http,
  parseAbi,
  parseAbiItem,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet, sepolia } from "viem/chains";
import NounsPool from "./contracts/NounsPool";
import NounsDAOLogicV2 from "./contracts/NounsDAOLogicV2";
import env from "dotenv";
env.config();

export type Chains = keyof typeof clients;

export const wallets = {
  [mainnet.network]: createWalletClient({
    account: privateKeyToAccount(process.env.PRIVATE_KEY as Address),
    chain: mainnet,
    transport: http(),
  }),
  [sepolia.network]: createWalletClient({
    account: privateKeyToAccount(process.env.PRIVATE_KEY as Address),
    chain: sepolia,
    transport: http(),
  }),
};

export const clients = {
  [mainnet.network]: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
  [sepolia.network]: createPublicClient({
    chain: sepolia,
    transport: http(),
  }),
};

export const contracts = {
  [mainnet.network]: {
    NounsPool: getContract({
      address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      abi: NounsPool,
      publicClient: clients.homestead,
      walletClient: wallets.homestead,
    }),
  },
  [sepolia.network]: {
    NounsPool: getContract({
      address: "0xd27dfb807DC3435AC3e14b55FcF1B50F96fF769a",
      abi: NounsPool,
      publicClient: clients.sepolia,
      walletClient: wallets.sepolia,
    }),
    NounsDAOLogicV2: getContract({
      address: "0x75D84FC49Dc8A423604BFCd46E0AB7D340D5ea38",
      abi: NounsDAOLogicV2,
      publicClient: clients.sepolia,
      walletClient: wallets.sepolia,
    }),
  },
};

// import createConfig from "./src/utils/createConfig";

// export const { clients, wallets, contracts } = createConfig({
//   NounsPool: {
//     abi: [
//       "struct Bid { uint256 amount; uint256 remainingAmount; uint256 remainingVotes; uint256 creationBlock; uint256 startBlock; uint256 endBlock; uint256 bidBlock; uint256 support; address bidder; bool executed; bool refunded; }",
//       "event BidPlaced(address indexed dao, uint256 indexed propId, uint256 support, uint256 amount, address bidder)",
//       "function getBid(uint256 _pId) external view returns (Bid memory)",
//       "function castVote(uint256 _pId) external",
//     ],
//     deployments: [
//       { chain: mainnet, address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2" },
//       { chain: sepolia, address: "0xd27dfb807DC3435AC3e14b55FcF1B50F96fF769a" },
//     ],
//   },
// });

/*

{
  NounsPool: {
    homestead: {
      address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      abi: [
       "struct Bid { uint256 amount; uint256 remainingAmount; uint256 remainingVotes; uint256 creationBlock; uint256 startBlock; uint256 endBlock; uint256 bidBlock; uint256 support; address bidder; bool executed; bool refunded; }",
       "event BidPlaced(address indexed dao, uint256 indexed propId, uint256 support, uint256 amount, address bidder)",
       "function getBid(uint256 _pId) external view returns (Bid memory)",
       "function castVote(uint256 _pId) external",
      ],
      publicClient: ...,
      walletClient: ...,
    },
    sepolia: {
      address: "0xd27dfb807DC3435AC3e14b55FcF1B50F96fF769a",
      abi: [
       "struct Bid { uint256 amount; uint256 remainingAmount; uint256 remainingVotes; uint256 creationBlock; uint256 startBlock; uint256 endBlock; uint256 bidBlock; uint256 support; address bidder; bool executed; bool refunded; }",
       "event BidPlaced(address indexed dao, uint256 indexed propId, uint256 support, uint256 amount, address bidder)",
       "function getBid(uint256 _pId) external view returns (Bid memory)",
       "function castVote(uint256 _pId) external",
      ],
      publicClient: ...,
      walletClient: ...,
    }
  }
}

watch(NounsPool.sepolia, "BidPlaced", () => {})

function watch(contract, event, callback) {
  contract.publicClient.watchContractEvent({
    address: contract.address,
    abi: contract.abi,
    onLogs: (logs) => {
      for (const log of logs) {
        callback(log);
      }
    }
  })
}

*/
