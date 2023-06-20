import BotSwarm from "./src/BotSwarm";
import castVote from "./src/tasks/castVote";
import setupTest from "./src/utils/setupTest";

setupTest(async () => {
  const { addTask, contracts } = BotSwarm();

  const { NounsPool, NounsDAOLogicV2 } = contracts;

  NounsPool.sepolia.watchEvent.BidPlaced(
    {},
    {
      onLogs: async (events) => {
        for (const { args } of events) {
          if (args.propId) {
            const config = await NounsPool.sepolia.read.getConfig();
            const proposal = await NounsDAOLogicV2.sepolia.read.proposals([
              args.propId,
            ]);

            addTask(
              castVote({
                id: `castVote:${args.propId}`,
                chain: "sepolia",
                block: proposal.endBlock - config.castWindow,
                proposal: args.propId,
              })
            );
          }
        }
      },
    }
  );
});
