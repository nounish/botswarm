import { Chain } from "viem";
import logger from "./logger";

export default function scheduler(log: ReturnType<typeof logger>) {
  let tasks: Array<{
    id: string;
    chain: string;
    block: bigint;
    execute: Function;
  }> = [];

  function addTask(args: {
    id: string;
    chain: Chain;
    block: bigint;
    task: () => Promise<boolean>;
  }) {
    const exists = tasks.find((task) => task.id === args.id);

    if (exists) {
      log.error(
        `Failed to schedule ${log.colors.red(
          args.id
        )} for block ${log.colors.yellow(Number(args.block))} on ${
          args.chain.name
        }`
      );
      return false;
    }

    tasks.push({
      id: args.id,
      chain: args.chain.name,
      block: args.block,
      execute: args.task,
    });

    log.info(
      `Task ${log.colors.blue(args.id)} scheduled for block ${log.colors.yellow(
        Number(args.block)
      )} on ${args.chain}`
    );

    return true;
  }

  function removeTask(id: string) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  }

  return {
    tasks: () => tasks,
    addTask,
    removeTask,
  };
}
