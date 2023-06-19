import { sepolia } from "viem/chains";
import { contracts } from "./botswarm.config";
import BotSwarm from "./src/BotSwarm";
import castVote from "./src/tasks/castVote";
import setupTest from "./src/utils/setupTest";

const { NounsPool } = contracts.sepolia;

setupTest(async () => {
  // const { watch, addTask } = BotSwarm();
  // watch(NounsPool, "BidPlaced", async ({ blockNumber, args }) => {
  //   // const config = await NounsPool.read._cfg();
  //   if (args.propId) {
  //     addTask(
  //       castVote({
  //         chain: sepolia.network,
  //         block: blockNumber,
  //         proposalId: args.propId,
  //       })
  //     );
  //   }
  // });
});
