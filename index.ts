import { mainnet } from "viem/chains";
import { contracts } from "./botswarm.config";
import BotSwarm from "./src/BotSwarm";
import castVote from "./src/tasks/castVote";

const { NounsPool } = contracts.homestead;

const { watch, addTask } = BotSwarm();

watch(NounsPool, "BidPlaced", ({ blockNumber, args }) => {
  if (args.propId) {
    addTask(
      castVote({
        chain: mainnet.network,
        block: blockNumber,
        proposalId: args.propId,
      })
    );
  }
});
