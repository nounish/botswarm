import { Task } from "../BotSwarm";
import { contracts, clients } from "../../botswarm.config";

export default function castVote(args: {
  chain: keyof typeof clients;
  block: bigint;
  proposalId: bigint;
}): Task {
  return {
    id: `castVote:${args.proposalId}`,
    chain: args.chain,
    block: args.block,
    isExecuting: false,
    execute: async () => {
      const bid = await contracts.NounsPool[args.chain].read.getBid([
        args.proposalId,
      ]);

      if (bid.executed) {
        return false;
      }

      const hash = await contracts.NounsPool[args.chain].write.castVote([
        args.proposalId,
      ]);

      const result = await clients[args.chain].waitForTransactionReceipt({
        hash,
      });

      if (result.status === "reverted") {
        return false;
      }

      return true;
    },
  };
}
