import { mainnet, sepolia } from "viem/chains";
import NounsPool from "./contracts/NounsPool";
import NounsDAOLogicV2 from "./contracts/NounsDAOLogicV2";
import createConfig from "./src/utils/createConfig";

export default createConfig({
  NounsPool: {
    abi: NounsPool,
    deployments: [
      { chain: mainnet, address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2" },
      { chain: sepolia, address: "0xd27dfb807DC3435AC3e14b55FcF1B50F96fF769a" },
    ],
  },
  NounsDAOLogicV2: {
    abi: NounsDAOLogicV2,
    deployments: [
      { chain: mainnet, address: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d" },
      { chain: sepolia, address: "0x75D84FC49Dc8A423604BFCd46E0AB7D340D5ea38" },
    ],
  },
});
