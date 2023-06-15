import { Task } from "../lib/scheduler";
import { Chains, contracts, clients } from "../../botswarm.config";

export default function castVote(args: {
  chain: Chains;
  block: bigint;
  proposalId: bigint;
}): Task {
  return {
    id: `castVote:${args.proposalId}`,
    chain: args.chain,
    block: args.block,
    execute: async () => {
      const hash = await contracts[args.chain].NounsPool.write.castVote([
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
