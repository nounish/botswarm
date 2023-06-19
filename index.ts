import BotSwarm from "./src/BotSwarm";
import castVote from "./src/tasks/castVote";

const { addTask, contracts } = BotSwarm();

const { NounsPool } = contracts;

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
