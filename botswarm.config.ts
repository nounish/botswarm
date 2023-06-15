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
import env from "dotenv";
env.config();

export const wallets = {
  ethereum: createWalletClient({
    account: privateKeyToAccount(process.env.PRIVATE_KEY as Address),
    chain: mainnet,
    transport: http(),
  }),
  sepolia: createWalletClient({
    account: privateKeyToAccount(process.env.PRIVATE_KEY as Address),
    chain: sepolia,
    transport: http(),
  }),
};

export const clients = {
  ethereum: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
  sepolia: createPublicClient({
    chain: sepolia,
    transport: http(),
  }),
};

export const contracts = {
  ethereum: {
    NounsPool: getContract({
      address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
      abi: [
        // parseAbi([
        //   "function castVote(uint256 proposalId, uint8 support) external",
        //   "event BidPlaced(address indexed dao, uint256 indexed propId, uint256 support, uint256 amount, address bidder)",
        // ]),
        parseAbiItem(
          "function castVote(uint256 proposalId, uint8 support) external"
        ),
        parseAbiItem(
          "event BidPlaced(address indexed dao, uint256 indexed propId, uint256 support, uint256 amount, address bidder)"
        ),
      ],
      publicClient: clients.ethereum,
      walletClient: wallets.ethereum,
    }),
  },
  sepolia: {
    NounsPool: getContract({
      address: "0xd27dfb807DC3435AC3e14b55FcF1B50F96fF769a",
      abi: [
        parseAbiItem(
          "function castVote(uint256 proposalId, uint8 support) external"
        ),
        parseAbiItem(
          "event BidPlaced(address indexed dao, uint256 indexed propId, uint256 support, uint256 amount, address bidder)"
        ),
      ],
      publicClient: clients.sepolia,
      walletClient: wallets.sepolia,
    }),
  },
};

export type Chains = keyof typeof contracts;
