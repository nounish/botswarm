import executor from "./lib/executor.js";
import scheduler from "./lib/scheduler.js";
import watcher from "./lib/watcher.js";
import { start } from "./lib/logger.js";
import createConfig, {
  Client,
  Contract,
  Wallet,
} from "./utils/createConfig.js";
import _ from "viem/node_modules/abitype";

export default function BotSwarm<TContracts extends Record<string, Contract>>(
  contracts: TContracts,
  options: {
    cache?: boolean;
    log?: boolean;
  } = { cache: true, log: true }
) {
  if (options.log) start();

  const { clients, wallets } = createConfig(contracts);

  const {
    tasks,
    rescheduled,
    addTask,
    removeTask,
    rescheduleTask,
    cacheTasks,
  } = scheduler(contracts, { cache: options.cache, log: options.log });
  const { execute, executing, write } = executor(contracts, clients, wallets);
  const { onBlock, watch, read } = watcher(contracts, clients);

  for (const chain in clients) {
    onBlock(chain, async (block) => {
      for (const task of tasks()) {
        if (
          task.execute.chain === chain &&
          task.block <= block &&
          !executing()[task.id]
        ) {
          const success = await execute(task);

          if (success) {
            removeTask(task.id);
            continue;
          }

          if (rescheduled()[task.id]) {
            removeTask(task.id);
            continue;
          }

          rescheduleTask(task.id);
        }
      }
    });
  }

  return {
    // Config
    clients,
    wallets,
    contracts,

    // Scheduler
    tasks,
    rescheduled,
    addTask,
    removeTask,
    rescheduleTask,
    cacheTasks,

    // Executor
    execute,
    executing,
    write,

    // Watcher
    onBlock,
    watch,
    read,
  };
}
