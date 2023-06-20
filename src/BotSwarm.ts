import config from "../botswarm.config";
import colors from "kleur";
import logger from "./utils/logger";

export type Task = {
  id: string;
  chain: keyof typeof config.clients;
  block: bigint;
  execute: () => Promise<string>;
};

export default function BotSwarm() {
  const log = logger("Waiting for task");

  let tasks: Array<Task & { isExecuting: boolean }> = [];

  function addTask(task: Task) {
    const exists = tasks.find((task) => task.id === task.id);

    if (exists) {
      return false;
    }

    tasks.push({ ...task, isExecuting: false });

    log.info(
      `Task ${colors.blue(task.id)} scheduled for block ${colors.yellow(
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

  for (const [chain, client] of Object.entries(config.clients)) {
    client.watchBlockNumber({
      onBlockNumber: async (block) => {
        for (const task of tasks) {
          if (
            !task.isExecuting &&
            task.chain === chain &&
            task.block <= block
          ) {
            task.isExecuting = true;

            log.executing(
              `Executing task ${colors.blue(task.id)} at block ${colors.yellow(
                Number(block)
              )}`
            );

            try {
              const response = await task.execute();
              log.success(`Task ${colors.green(task.id)} was executed`);
            } catch (error) {
              log.error(error as string);
              log.error(`Task ${colors.red(task.id)} failed`);
            } finally {
              removeTask(task.id);
            }
          }
        }
      },
    });
  }

  return {
    log,
    tasks: () => tasks,
    addTask,
    removeTask,
    contracts: config.contracts,
    clients: config.clients,
    wallets: config.wallets,
  };
}
