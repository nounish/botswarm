import { contracts } from "./botswarm.config";
import BotSwarm from "./src/BotSwarm";
import castVote from "./src/tasks/castVote";
import setupTest from "./src/utils/setupTest";

const { NounsPool } = contracts;

setupTest(async () => {
  const { addTask } = BotSwarm();

  NounsPool.sepolia.watchEvent.BidPlaced(
    {},
    {
      onLogs: async (events) => {
        for (const { args } of events) {
          if (args.propId) {
            const config = await contracts.NounsPool.sepolia.read.getConfig();
            const proposal =
              await contracts.NounsDAOLogicV2.sepolia.read.proposals([
                args.propId,
              ]);

            addTask(
              castVote({
                chain: "sepolia",
                block: proposal.endBlock - config.castWindow,
                proposalId: args.propId,
              })
            );
          }
        }
      },
    }
  );
});
