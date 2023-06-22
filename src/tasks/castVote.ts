import { Task } from "../BotSwarm";
import config from "../../botswarm.config";

export default function castVote(args: {
  id: Task["id"];
  chain: Task["chain"];
  block: bigint;
  proposal: bigint;
}): Task {
  return {
    id: args.id,
    chain: args.chain,
    block: Number(args.block),
    execute: async () => {
      const bid = await config.contracts.NounsPool[args.chain].read.getBid([
        args.proposal,
      ]);

      if (bid.executed) {
        return `Vote was already cast for proposal ${args.proposal}`;
      }

      const hash = await config.contracts.NounsPool[args.chain].write.castVote([
        args.proposal,
      ]);

      const result = await config.clients[args.chain].waitForTransactionReceipt(
        {
          hash,
        }
      );

      if (result.status === "reverted") {
        return `castVote reverted for proposal ${args.proposal}`;
      }

      return `Vote was sucessfully cast for proposal ${args.proposal}`;
    },
  };
}
