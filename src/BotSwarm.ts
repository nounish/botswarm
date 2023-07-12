import executor from "./lib/executor.js";
import scheduler from "./lib/scheduler.js";
import watcher from "./lib/watcher.js";
import { start } from "./lib/logger.js";
import createConfig, { RPCs, Contract } from "./utils/createConfig.js";
import type _ from "viem/node_modules/abitype";

export default function BotSwarm<TContracts extends Record<string, Contract>>(
  contracts: TContracts,
  config?: {
    cache?: boolean;
    log?: boolean;
    rpcs?: RPCs;
    gasLimitBuffer?: number;
    blockExecutionBuffer?: number;
  }
) {
  const options = {
    cache: true,
    log: true,
    rpcs: {
      mainnet: "https://rpc.flashbots.net/",
    },
    gasLimitBuffer: 30000,
    blockExecutionBuffer: 0,
    ...config,
  };

  if (options.log) start();

  const { clients, wallets } = createConfig(contracts, options.rpcs);

  const {
    tasks,
    rescheduled,
    addTask,
    removeTask,
    rescheduleTask,
    cacheTasks,
  } = scheduler(contracts, { cache: options.cache, log: options.log });
  const { execute, executing, write } = executor(contracts, clients, wallets, {
    gasLimitBuffer: options.gasLimitBuffer,
  });
  const { onBlock, watch, read } = watcher(contracts, clients);

  for (const chain in clients) {
    onBlock(chain, async (block) => {
      for (const task of tasks()) {
        if (
          task.chain === chain &&
          task.block <= block + BigInt(options.blockExecutionBuffer) &&
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
