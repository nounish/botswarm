import { clients } from "../botswarm.config";
import logger from "./lib/logger";
import scheduler from "./lib/scheduler";
import watcher from "./lib/watcher";

export default function BotSwarm() {
  const log = logger("Waiting for task");
  const { tasks, addTask, removeTask } = scheduler(log);
  const { watch } = watcher(log);

  for (const [chain, client] of Object.entries(clients)) {
    client.watchBlockNumber({
      onBlockNumber: async (block) => {
        for (const task of tasks()) {
          if (task.chain === chain && task.block <= block) {
            log.executing(
              `Executing task ${log.colors.blue(
                task.id
              )} at block ${log.colors.yellow(Number(block))}`
            );

            const success = await task.execute();

            if (success) {
              removeTask(task.id);
              log.success(`Task ${log.colors.green(task.id)} completed`);
            } else {
              // TODO: Add logic to retry task if failed
              log.error(`Task ${log.colors.red(task.id)} failed`);
            }
          }
        }
      },
    });
  }

  return {
    log,
    watch,
    addTask,
    removeTask,
  };
}
