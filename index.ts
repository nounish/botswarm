import BotSwarm from "./src/BotSwarm";
import castVote from "./src/tasks/castVote";

const { addTask, contracts } = BotSwarm();

const { NounsPool, NounsDAOLogicV2 } = contracts;

NounsPool.homestead.watchEvent.BidPlaced(
  {},
  {
    onLogs: async (events) => {
      for (const { args } of events) {
        if (args.propId) {
          const config = await NounsPool.homestead.read.getConfig();
          const proposal = await NounsDAOLogicV2.homestead.read.proposals([
            args.propId,
          ]);

          addTask(
            castVote({
              id: `castVote:${args.propId}`,
              chain: "homestead",
              block: proposal.endBlock - config.castWindow,
              proposal: args.propId,
            })
          );
        }
      }
    },
  }
);
