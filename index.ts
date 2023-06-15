import { mainnet } from "viem/chains";
import { clients, contracts } from "./botswarm.config";
import BotSwarm from "./src/BotSwarm";
import castVote from "./src/tasks/castVote";

const { NounsPool } = contracts.homestead;

const { watch, log, addTask } = BotSwarm();

watch(NounsPool, "BidPlaced", ({ blockNumber, args }) => {
  log.info("Bid placed on Nouns Pool");

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
