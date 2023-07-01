import executor from "./lib/executor";
import scheduler from "./lib/scheduler";
import watcher from "./lib/watcher";
import createConfig, { Contract } from "./utils/createConfig";

export default function BotSwarm<TContracts extends Record<string, Contract>>(
  config: TContracts
) {
  const { clients, wallets, contracts } = createConfig(config);

  const { tasks, addTask, removeTask, cacheTasks } = scheduler(contracts);
  const { execute, executing, write } = executor(contracts, clients, wallets);
  const { onBlock, watch, read } = watcher(contracts, clients);

  for (const chain in clients) {
    onBlock(chain, (chain, block) => {
      for (const task of tasks()) {
        if (
          !executing()[task.id] &&
          task.execute.chain === chain &&
          task.block <= block
        ) {
          execute(task);
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
    addTask,
    removeTask,
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
