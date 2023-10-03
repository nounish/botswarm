import { Contract } from "../../utils/createConfig";
import NounsDAOLogicV2ABI from "./abi/NounsDAOLogicV2";

export const NounsDAOLogicV2 = {
  abi: NounsDAOLogicV2ABI,
  deployments: {
    mainnet: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d",
    sepolia: "0x75D84FC49Dc8A423604BFCd46E0AB7D340D5ea38",
  },
} as const satisfies Contract;
