import { mainnet } from "viem/chains";
import { contracts } from "./botswarm.config";
import castVote from "./src/tasks/castVote";
import BotSwarm from "./src/BotSwarm";

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
