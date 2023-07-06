import { join } from "path";
import { existsSync, writeFileSync, mkdirSync, readFileSync } from "fs";
import { createHash } from "crypto";
import { Contract, Chain } from "../utils/createConfig.js";
import {
  AbiParametersToPrimitiveTypes,
  Address,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";
import { active, colors, error, success } from "./logger.js";
import { stringify, parse } from "../utils/customSerializer.js";

export type Task = {
  id: string;
  block: bigint;
  execute: {
    contract: string;
    chain: Chain;
    functionName: string;
    args: any[];
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

      let _tasks: Array<Task> = parse(readFileSync(cache, "utf-8"));
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
    TContract extends keyof TContracts,
    TChain extends keyof TContracts[TContract]["deployments"],
    TFunctionName extends ExtractAbiFunctionNames<
      TContracts[TContract]["abi"],
      "payable" | "nonpayable"
    >,
    TArgs extends AbiParametersToPrimitiveTypes<
      ExtractAbiFunction<TContracts[TContract]["abi"], TFunctionName>["inputs"]
    >
  >(config: {
    block: number;
    execute: {
      contract: TContract;
      chain: TChain;
      functionName: TFunctionName;
      args?: TArgs;
    };
  }) {
    if (options.log) {
      active(
        `Adding task ${config.execute.contract as string}:${colors.blue(
          config.execute.functionName
        )}`
      );
    }

    const task: Task = {
      id: createHash("sha256").update(stringify(config)).digest("hex"),
      block: BigInt(config.block),
      execute: {
        contract: config.execute.contract as string,
        chain: config.execute.chain as Chain,
        functionName: config.execute.functionName,
        args: config.execute.args as any,
      },
    };

    if (tasks.find((_task) => _task.id === task.id)) {
      if (options.log) {
        error(
          `Failed to add task ${
            config.execute.contract as string
          }:${colors.blue(config.execute.functionName)} already exists`
        );
      }

      return false;
    }

    tasks.push(task);

    if (options.cache) cacheTasks();

    if (options.log) {
      success(
        `Sucessfully added task ${
          config.execute.contract as string
        }:${colors.blue(config.execute.functionName)} for block ${colors.yellow(
          Number(config.block)
        )}`
      );
    }

    return true;
  }

  function removeTask(id: string) {
    const index = tasks.findIndex((task) => task.id === id);
    const task = tasks[index];

    if (index === -1) {
      if (options.log) {
        error(
          `Failed to remove task ${task.execute.contract}:${colors.blue(
            task.execute.functionName
          )} does not exist`
        );
      }
      return false;
    }

    tasks.splice(index, 1);

    if (options.cache) cacheTasks();

    if (options.log) {
      success(
        `Sucessfully removed task ${task.execute.contract}:${colors.blue(
          task.execute.functionName
        )}`
      );
    }

    return true;
  }

  function rescheduleTask(id: string) {
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      if (options.log) {
        error(
          `Failed to reschedule task ${
            tasks[index].execute.contract
          }:${colors.blue(tasks[index].execute.functionName)} does not exist`
        );
      }
      return false;
    }

    tasks[index].block += 5n;
    rescheduled[id] = true;

    if (options.cache) cacheTasks();

    if (options.log) {
      success(
        `Sucessfully rescheduled task ${
          tasks[index].execute.contract
        }:${colors.blue(
          tasks[index].execute.functionName
        )} for block ${colors.yellow(Number(tasks[index].block))}`
      );
    }

    return true;
  }

  function cacheTasks() {
    const directory = join(process.cwd(), ".botswarm");

    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    writeFileSync(join(directory, "cache.txt"), stringify(tasks));
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
