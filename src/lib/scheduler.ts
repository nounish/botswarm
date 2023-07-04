import { join } from "path";
import { existsSync, writeFileSync, mkdirSync, readFileSync } from "fs";
import { createHash } from "crypto";
import { Contract, Chain } from "../utils/createConfig.js";
import { Address, ExtractAbiFunctionNames } from "abitype";
import { active, colors, error, success } from "./logger.js";

export type Task = {
  id: string;
  block: number;
  execute: {
    contract: Address;
    chain: Chain;
    functionName: string;
  };
};

export default function scheduler<TContracts extends Record<string, Contract>>(
  contracts: TContracts,
  options: { cache?: boolean; log?: boolean } = { cache: true, log: true }
) {
  let tasks: Array<Task> = [];
  let rescheduled: Record<string, boolean> = {};

  if (options.cache) {
    const cache = join(process.cwd(), ".botswarm", "cache.txt");

    if (existsSync(cache)) {
      active("Loading cached tasks");

      let _tasks: Array<Task> = JSON.parse(readFileSync(cache, "utf-8"));
      tasks = _tasks;

      for (const task of _tasks) {
        success(
          `Cached task ${colors.blue(
            task.execute.functionName
          )} rescheduled for block ${colors.yellow(Number(task.block))}`
        );
      }

      success("Finished syncing cached tasks");
    }
  }

  function addTask<
    TContract extends (typeof contracts)[keyof typeof contracts],
    TChain extends keyof TContract["deployments"],
    TFunctionName extends ExtractAbiFunctionNames<
      TContract["abi"],
      "payable" | "nonpayable"
    >
  >(config: {
    block: number;
    execute: {
      contract: TContract;
      chain: TChain;
      functionName: TFunctionName;
    };
  }) {
    if (options.log) {
      active(`Adding task: ${colors.blue(config.execute.functionName)}`);
    }

    const task: Task = {
      id: createHash("sha256").update(JSON.stringify(config)).digest("hex"),
      block: config.block,
      execute: {
        // @ts-ignore The generic types in the function header ensure this is defined
        contract: config.execute.contract.deployments[config.execute.chain],
        chain: config.execute.chain as Chain,
        functionName: config.execute.functionName,
      },
    };

    if (tasks.find((_task) => _task.id === task.id)) {
      if (options.log) {
        error(
          `Failed to add task: ${colors.blue(
            config.execute.functionName
          )} already exists`
        );
      }

      return false;
    }

    tasks.push(task);

    if (options.cache) cacheTasks();

    if (options.log) {
      success(
        `Sucessfully added task: ${colors.blue(
          config.execute.functionName
        )} for block ${colors.yellow(config.block)}`
      );
    }

    return true;
  }

  function removeTask(id: string) {
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      if (options.log) {
        error(`Failed to remove task: ${colors.blue(id)} does not exist`);
      }
      return false;
    }

    tasks.splice(index, 1);

    if (options.cache) cacheTasks();

    if (options.log) {
      success(
        `Sucessfully removed task: ${colors.blue(
          tasks[index].execute.functionName
        )}`
      );
    }

    return true;
  }

  function rescheduleTask(id: string, block: number) {
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      if (options.log) {
        error(`Failed to reschedule task: ${colors.blue(id)} does not exist`);
      }
      return false;
    }

    tasks[index].block = block;
    rescheduled[id] = true;

    if (options.cache) cacheTasks();

    if (options.log) {
      success(
        `Sucessfully rescheduled task: ${colors.blue(
          tasks[index].execute.functionName
        )} for block ${colors.yellow(block)}`
      );
    }

    return true;
  }

  function cacheTasks() {
    const directory = join(process.cwd(), ".botswarm");

    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    writeFileSync(join(directory, "cache.txt"), JSON.stringify(tasks));
  }

  return {
    tasks: () => tasks,
    rescheduled: () => rescheduled,
    addTask,
    removeTask,
    cacheTasks,
    rescheduleTask,
  };
}
