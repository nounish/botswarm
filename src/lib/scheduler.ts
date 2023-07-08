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
import parseTaskIdentifier from "../utils/parseTaskIdentifier.js";

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
    block: number | bigint;
    contract: TContract;
    chain: TChain;
    functionName: TFunctionName;
    args?: TArgs;
  }) {
    const task: Task = {
      id: createHash("sha256").update(stringify(config)).digest("hex"),
      block:
        typeof config.block === "number" ? BigInt(config.block) : config.block,
      execute: {
        contract: config.contract as string,
        chain: config.chain as Chain,
        functionName: config.functionName,
        args: config.args as any,
      },
    };

    const identifier = parseTaskIdentifier(
      task.execute.contract,
      task.execute.functionName,
      task.id
    );

    if (options.log) {
      active(`Adding task ${identifier}`);
    }

    if (tasks.find((_task) => _task.id === task.id)) {
      if (options.log) {
        error(`Failed to add task ${identifier} already exists`);
      }

      return false;
    }

    tasks.push(task);

    if (options.cache) cacheTasks();

    if (options.log) {
      success(
        `Sucessfully added task ${identifier} for block ${colors.yellow(
          Number(config.block)
        )}`
      );
    }

    return true;
  }

  function removeTask(id: string) {
    const index = tasks.findIndex((task) => task.id === id);
    const task = tasks[index];

    const identifier = parseTaskIdentifier(
      task.execute.contract,
      task.execute.functionName,
      task.id
    );

    if (index === -1) {
      if (options.log) {
        error(`Failed to remove task ${identifier} does not exist`);
      }
      return false;
    }

    tasks.splice(index, 1);

    if (options.cache) cacheTasks();

    if (options.log) {
      success(`Sucessfully removed task ${identifier}`);
    }

    return true;
  }

  function rescheduleTask(id: string) {
    const index = tasks.findIndex((task) => task.id === id);
    let task = tasks[index];

    const identifier = parseTaskIdentifier(
      task.execute.contract,
      task.execute.functionName,
      task.id
    );

    if (index === -1) {
      if (options.log) {
        error(`Failed to reschedule task ${identifier} does not exist`);
      }
      return false;
    }

    task.block += 5n;
    rescheduled[id] = true;

    if (options.cache) cacheTasks();

    if (options.log) {
      success(
        `Sucessfully rescheduled task ${identifier} for block ${colors.yellow(
          Number(task.block)
        )}`
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
