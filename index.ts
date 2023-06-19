import { mainnet } from "viem/chains";
import { contracts } from "./botswarm.config";
import BotSwarm from "./src/BotSwarm";
import castVote from "./src/tasks/castVote";

const { NounsPool } = contracts;

const { addTask } = BotSwarm();

NounsPool.homestead.watchEvent.BidPlaced(
  {},
  {
    onLogs: (events) => {
      for (const { blockNumber, args } of events) {
        if (blockNumber && args.propId) {
          addTask(
            castVote({
              chain: "homestead",
              block: blockNumber,
              proposalId: args.propId,
            })
          );
        }
      }
    },
  }
);
