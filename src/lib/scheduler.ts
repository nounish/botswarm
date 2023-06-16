import { Chain } from "viem";
import logger from "./logger";
import { Chains } from "../../botswarm.config";

export type Task = {
  id: string;
  chain: Chains;
  block: bigint;
  isExecuting: boolean;
  execute: () => Promise<boolean>;
};

export default function scheduler(log: ReturnType<typeof logger>) {
  let tasks: Task[] = [];

  function addTask(task: {
    id: string;
    chain: Chains;
    block: bigint;
    execute: () => Promise<boolean>;
  }) {
    const exists = tasks.find((task) => task.id === task.id);

    if (exists) {
      log.error(
        `Failed to schedule ${log.colors.red(
          task.id
        )} for block ${log.colors.yellow(Number(task.block))} on ${task.chain}`
      );
      return false;
    }

    tasks.push({ ...task, isExecuting: false });

    log.info(
      `Task ${log.colors.blue(task.id)} scheduled for block ${log.colors.yellow(
        Number(task.block)
      )} on ${task.chain}`
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
