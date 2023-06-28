import { Task } from "../BotSwarm";
import config from "../../botswarm.config";

export default {
  doNothing: async (task: Task) => {
    return "Successfully did nothing for testing purposes";
  },
  castVote: async (task: Task) => {
    if (!task.data?.proposal) {
      return `Task castVote requires a proposal id`;
    }

    const bid = await config.contracts.NounsPool[task.chain].read.getBid([
      BigInt(task.data.proposal),
    ]);

    if (bid.executed) {
      return `Vote was already cast for proposal ${task.data.proposal}`;
    }

    const hash = await config.contracts.NounsPool[task.chain].write.castVote([
      BigInt(task.data.proposal),
    ]);

    const result = await config.clients[task.chain].waitForTransactionReceipt({
      hash,
    });

    if (result.status === "reverted") {
      return `castVote reverted for proposal ${task.data.proposal}`;
    }

    return `Vote was sucessfully cast for proposal ${task.data.proposal}`;
  },
};
