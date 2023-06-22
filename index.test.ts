import BotSwarm from "./src/BotSwarm";
import setupTest from "./src/lib/setupTest";

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

            addTask({
              id: `castVote:${args.propId}`,
              chain: "sepolia",
              block: Number(proposal.endBlock - config.castWindow),
              execute: "castVote",
              data: { proposal: Number(args.propId) },
            });
          }
        }
      },
    }
  );
});
