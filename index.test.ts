import { sepolia } from "viem/chains";
import { contracts } from "./botswarm.config";
import BotSwarm from "./src/BotSwarm";
import castVote from "./src/tasks/castVote";

const { NounsPool } = contracts.sepolia;

const { watch, log, addTask } = BotSwarm();

watch(NounsPool, "BidPlaced", ({ blockNumber, args }) => {
  if (args.propId) {
    addTask(
      castVote({
        chain: sepolia.network,
        block: blockNumber,
        proposalId: args.propId,
      })
    );
  }
});
