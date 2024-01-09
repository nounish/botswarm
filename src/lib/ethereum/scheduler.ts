import parseTaskIdentifier from "../../utils/parseTaskIdentifier.js";
import type { Contract, EthereumChains, Hook } from "./index.js";
import type {
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";
import { Logger, colors } from "../logger.js";
import { Cacher } from "../cacher.js";
import hash from "../../utils/hash.js";

export type Task = {
  id: string;
  schedule: {
    block: bigint;
    chain: EthereumChains;
  };
  execute: {
    hooks: readonly string[];
    contract: string;
    chain: EthereumChains;
    functionName: string;
    args: any[];
    priorityFee: number | bigint;
    maxBaseFeeForPriority: number | bigint;
    value: number | bigint;
  };
};

export default function scheduler<TContracts extends Record<string, Contract>>(
  schedulerConfig: {
    contracts: TContracts;
    hooks: Record<string, Hook>;
    cacheTasks: boolean;
  },
  log: Logger,
  cacher: Cacher
) {
  let tasks: Array<Task> = [];
  let rescheduledTasks: Record<string, boolean> = {};

  if (schedulerConfig.cacheTasks) {
    log.active("Loading cached tasks");

    const _tasks: Array<Task> | undefined = cacher.load("tasks");

    if (_tasks) tasks = _tasks;

    for (const task of tasks) {
      const identifier = parseTaskIdentifier(task);
      log.success(
        `Cached task ${identifier} rescheduled for block ${colors.yellow(
          Number(task.schedule.block)
        )}`
      );
    }

    log.success("Finished syncing cached tasks");
  }

  function addTask<
    TContract extends keyof TContracts,
    TExecuteChain extends keyof TContracts[TContract]["deployments"],
    TFunctionName extends ExtractAbiFunctionNames<
      TContracts[TContract]["abi"],
      "payable" | "nonpayable"
    >,
    TArgs extends AbiParametersToPrimitiveTypes<
      ExtractAbiFunction<TContracts[TContract]["abi"], TFunctionName>["inputs"]
    >
  >(config: {
    schedule: {
      block: number | bigint;
      chain: EthereumChains;
    };
    execute: {
      hooks?: readonly string[];
      contract: TContract;
      chain: TExecuteChain;
      functionName: TFunctionName;
      args?: TArgs;
      priorityFee?: number | bigint;
      maxBaseFeeForPriority?: number | bigint;
      value?: number | bigint;
    };
  }) {
    const task: Task = {
      id: hash(config),
      schedule: {
        block:
          typeof config.schedule.block === "number"
            ? BigInt(config.schedule.block)
            : config.schedule.block,
        chain: config.schedule.chain as EthereumChains,
      },
      execute: {
        hooks: (config.execute.hooks as string[]) ?? [],
        contract: config.execute.contract as string,
        chain: config.execute.chain as EthereumChains,
        functionName: config.execute.functionName,
        args: config.execute.args as any,
        priorityFee: config.execute.priorityFee ?? 0,
        maxBaseFeeForPriority: config.execute.maxBaseFeeForPriority ?? 0,
        value: config.execute.value ?? 0,
      },
    };

    const identifier = parseTaskIdentifier(task);

    for (const hook of task.execute.hooks) {
      if (!schedulerConfig.hooks[hook]) {
        log.error(
          `Failed to add task ${identifier} hook ${hook} does not exist`
        );
        return false;
      }
    }

    log.active(`Adding task ${identifier}`);

    if (tasks.find((_task) => _task.id === task.id)) {
      log.error(`Failed to add task ${identifier} already exists`);

      return false;
    }

    tasks.push(task);

    if (schedulerConfig.cacheTasks) cacher.cache("tasks", tasks);

    log.success(
      `Sucessfully added task ${identifier} for block ${colors.yellow(
        Number(config.schedule.block)
      )}`
    );

    return true;
  }

  function getTask(id: string) {
    const task = tasks.find((task) => task.id === id);

    if (!task) {
      log.error(`Could not find task with id ${id}`);
    }

    return task;
  }

  function removeTask(id: string) {
    const index = tasks.findIndex((task) => task.id === id);
    const task = tasks[index];

    const identifier = parseTaskIdentifier(task);

    if (index === -1) {
      log.error(`Failed to remove task ${identifier} does not exist`);

      return false;
    }

    tasks.splice(index, 1);

    if (schedulerConfig.cacheTasks) cacher.cache("tasks", tasks);

    log.success(`Sucessfully removed task ${identifier}`);

    return true;
  }

  function rescheduleTask(
    id: string,
    block: number | bigint,
    flagAsRescheduled?: boolean
  ) {
    const index = tasks.findIndex((task) => task.id === id);
    let task = tasks[index];

    const identifier = parseTaskIdentifier(task);

    if (index === -1) {
      log.error(`Failed to reschedule task ${identifier} does not exist`);

      return false;
    }

    task.schedule.block = typeof block === "number" ? BigInt(block) : block;

    if (flagAsRescheduled) rescheduledTasks[id] = true;

    if (schedulerConfig.cacheTasks) cacher.cache("tasks", tasks);

    log.success(
      `Sucessfully rescheduled task ${identifier} for block ${colors.yellow(
        Number(task.schedule.block)
      )}`
    );

    return true;
  }

  return {
    tasks: () => tasks,
    rescheduledTasks: () => rescheduledTasks,
    addTask,
    getTask,
    removeTask,
    cacheTasks: () => cacher.cache("tasks", tasks),
    rescheduleTask,
  };
}
