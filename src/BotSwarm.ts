import config from "../botswarm.config";
import colors from "kleur";
import logger from "./utils/logger";
import fs from "fs";
import path from "path";
import execute from "./lib/tasks";

export type Task = {
  id: string;
  chain: keyof typeof config.clients;
  block: number;
  execute: keyof typeof execute;
  data?: Record<string, any>;
};

export default function BotSwarm(
  options: { cache?: boolean } = { cache: true }
) {
  const log = logger("Waiting for tasks");

  let tasks: Array<Task> = [];
  let executing: Record<string, boolean> = {};

  if (options.cache) {
    const exists = fs.existsSync(path.join(__dirname, "../cache.txt"));
    if (exists) {
      log.update("Loading cached tasks");

      let _tasks: Array<Task> = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../cache.txt"), "utf-8")
      );

      for (const task of _tasks) {
        log.info(
          `Cached task ${colors.blue(
            task.id
          )} rescheduled for block ${colors.yellow(Number(task.block))} on ${
            task.chain
          }`
        );
      }

      tasks = _tasks;

      log.success("Finished syncing cached tasks");
    }
  }

  function addTask(task: Task) {
    const exists = tasks.find((task) => task.id === task.id);

    if (exists) {
      return false;
    }

    tasks.push({ ...task });

    if (options.cache) {
      fs.writeFileSync(
        path.join(__dirname, "../cache.txt"),
        JSON.stringify(tasks)
      );
    }

    log.info(
      `Task ${colors.blue(task.id)} scheduled for block ${colors.yellow(
        Number(task.block)
      )} on ${task.chain}`
    );

    return true;
  }

  function removeTask(id: string) {
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      return false;
    }

    tasks.splice(index, 1);

    if (options.cache) {
      fs.writeFileSync(
        path.join(__dirname, "../cache.txt"),
        JSON.stringify(tasks)
      );
    }

    log.info(`Task ${colors.blue(id)} was sucessfully removed`);

    return true;
  }

  for (const [chain, client] of Object.entries(config.clients)) {
    client.watchBlockNumber({
      onBlockNumber: async (block) => {
        for (const task of tasks) {
          if (
            !executing[task.id] &&
            task.chain === chain &&
            task.block <= block
          ) {
            executing[task.id] = true;

            log.executing(
              `Executing task ${colors.blue(task.id)} at block ${colors.yellow(
                Number(block)
              )}`
            );

            try {
              await execute[task.execute](task);
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
