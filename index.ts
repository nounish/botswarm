import { mainnet } from "viem/chains";
import { contracts } from "./botswarm.config";
import BotSwarm from "./src/BotSwarm";
import castVote from "./src/tasks/castVote";

const { NounsPool } = contracts.ethereum;

const { watch, log, addTask } = BotSwarm();

watch(NounsPool, "BidPlaced", ({ blockNumber, args }) => {
  log.info("Bid placed on Nouns Pool");

  addTask({
    id: `castVote:${args.propId}`,
    chain: mainnet,
    block: blockNumber,
    task: castVote,
  });
});
