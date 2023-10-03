import NounsPoolABI from "./abi/NounsPool";
import NounsGovernorABI from "./abi/NounsGovernor";
import NounsRelayerABI from "./abi/NounsRelayer";
import { Contract } from "../../utils/createConfig";

export const NounsPool = {
  abi: NounsPoolABI,
  deployments: {
    mainnet: "0x0f722d69B3D8C292E85F2b1E5D9F4439edd58F1e",
    sepolia: "0xd27dfb807DC3435AC3e14b55FcF1B50F96fF769a",
  },
} as const satisfies Contract;

export const NounsGovernor = {
  abi: NounsGovernorABI,
  deployments: {
    zkSyncTestnet: "0x",
  },
} as const satisfies Contract;

export const NounsRelayer = {
  abi: NounsRelayerABI,
  deployments: {
    sepolia: "0x",
  },
} as const satisfies Contract;
