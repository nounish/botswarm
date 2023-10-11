// Federation
import FederationNounsPoolABI from "./abi/federation/NounsPool";
import FederationNounsGovernorABI from "./abi/federation/NounsGovernor";
import FederationNounsRelayerABI from "./abi/federation/NounsRelayer";

// Nouns
import NounsDAOLogicV3ABI from "./abi/nouns/NounsDAOLogicV3";
import NounsTokenABI from "./abi/nouns/NounsToken";
import NounsAuctionHouseABI from "./abi/nouns/NounsAuctionHouse";
import NounsSeederABI from "./abi/nouns/NounsSeeder";
import NounsDescriptorABI from "./abi/nouns/NounsDescriptor";
import NounsDAOExecutorV2ABI from "./abi/nouns/NounsDAOExecutorV2";

import type { Contract } from "../";

// Federation

export const FederationNounsPool = {
  abi: FederationNounsPoolABI,
  deployments: {
    mainnet: "0x0f722d69B3D8C292E85F2b1E5D9F4439edd58F1e",
    sepolia: "0xd27dfb807DC3435AC3e14b55FcF1B50F96fF769a",
  },
} as const satisfies Contract;

export const FederationNounsGovernor = {
  abi: FederationNounsGovernorABI,
  deployments: {
    zkSyncTestnet: "0x",
  },
} as const satisfies Contract;

export const FederationNounsRelayer = {
  abi: FederationNounsRelayerABI,
  deployments: {
    sepolia: "0x",
  },
} as const satisfies Contract;

// Nouns

export const NounsDAOLogicV3 = {
  abi: NounsDAOLogicV3ABI,
  deployments: {
    mainnet: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d",
    sepolia: "0x75D84FC49Dc8A423604BFCd46E0AB7D340D5ea38",
  },
} as const satisfies Contract;

export const NounsToken = {
  abi: NounsTokenABI,
  deployments: {
    mainnet: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
    sepolia: "0x4C4674bb72a096855496a7204962297bd7e12b85",
  },
} as const satisfies Contract;

export const NounsAuctionHouse = {
  abi: NounsAuctionHouseABI,
  deployments: {
    mainnet: "0xF15a943787014461d94da08aD4040f79Cd7c124e",
    sepolia: "0x488609b7113FCf3B761A05956300d605E8f6BcAf",
  },
} as const satisfies Contract;

export const NounsSeeder = {
  abi: NounsSeederABI,
  deployments: {
    mainnet: "0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515",
    sepolia: "0xe99b8Ee07B28C587B755f348649f3Ee45aDA5E7D",
  },
} as const satisfies Contract;

export const NounsDescriptor = {
  abi: NounsDescriptorABI,
  deployments: {
    mainnet: "0x0Cfdb3Ba1694c2bb2CFACB0339ad7b1Ae5932B63",
    sepolia: "0x5319dbcb313738aD70a3D945E61ceB8b84691928",
  },
} as const satisfies Contract;

export const NounsDAOExecutor = {
  abi: NounsDAOExecutorV2ABI,
  deployments: {
    mainnet: "0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71",
    sepolia: "0x07e5D6a1550aD5E597A9b0698A474AA080A2fB28",
  },
} as const satisfies Contract;
