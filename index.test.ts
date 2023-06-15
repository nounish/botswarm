import { sepolia } from "viem/chains";
import { contracts } from "./botswarm.config";
import BotSwarm from "./src/BotSwarm";
import castVote from "./src/tasks/castVote";

const { NounsPool } = contracts.sepolia;

const { watch, log, addTask } = BotSwarm();

watch(NounsPool, "BidPlaced", ({ blockNumber, args }) => {
  addTask({
    id: `castVote:${args.propId}`,
    chain: sepolia,
    block: blockNumber,
    task: castVote,
  });
});
