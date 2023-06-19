import { createSpinner } from "nanospinner";
import { clients, wallets, contracts } from "../botswarm.config";
import colors from "kleur";
import figlet from "figlet";
import { description, version } from "../package.json";

const defaultMessage = "Waiting for task";

let state = createSpinner(defaultMessage).start();

const log = {
  start: () => {
    console.log(
      figlet.textSync("BotSwarm", {
        font: "ANSI Shadow",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
    );

    console.log(colors.blue(description));
    console.log(`\nVersion: ${colors.magenta(version)}\n`);
  },
  info: (message: string) => {
    state.warn({
      text: message,
      mark: "🔹",
    });
    state = createSpinner(defaultMessage).start();
  },
  success: (message: string) => {
    state.success({
      text: message,
    });
    state = createSpinner(defaultMessage).start();
  },
  error: (message: string) => {
    state.error({
      text: message,
    });
    state = createSpinner(defaultMessage).start();
  },
  executing: (message: string) => {
    state.update({
      text: message,
      color: "blue",
    });
  },
};

export type Task = {
  id: string;
  chain: keyof typeof clients;
  block: bigint;
  isExecuting: boolean;
  execute: () => Promise<boolean>;
};

export default function BotSwarm() {
  log.start();

  let tasks: Task[] = [];

  function addTask(task: {
    id: string;
    chain: Task["chain"];
    block: bigint;
    execute: () => Promise<boolean>;
  }) {
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

  for (const [chain, client] of Object.entries(clients)) {
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
              await task.execute();
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
    contracts,
    clients,
    wallets,
  };
}
