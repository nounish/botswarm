import path from "path";
import fs from "fs";
import { createHash } from "crypto";
import { Contract } from "../utils/createConfig";
import { ValueOf } from "viem/dist/types/types/utils";
import { ExtractAbiFunctionNames } from "abitype";

export type Task = {
  id: string;
  block: number;
  execute: {
    contract: Contract;
    chain: string;
    functionName: string;
  };
};

export default function scheduler<TContracts extends Record<string, Contract>>(
  contracts: TContracts,
  options: { cache?: boolean } = { cache: true }
) {
  let tasks: Array<Task> = [];

  function addTask<
    TContract extends ValueOf<typeof contracts>,
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
    const task: Task = {
      id: createHash("sha256").update(JSON.stringify(config)).digest("hex"),
      block: config.block,
      execute: {
        contract: config.execute.contract,
        chain: config.execute.chain as string,
        functionName: config.execute.functionName as string,
      },
    };

    if (tasks.find((_task) => _task.id === task.id)) {
      return false;
    }

    tasks.push(task);

    cacheTasks();

    return true;
  }

  function removeTask(id: string) {
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) {
      return false;
    }

    tasks.splice(index, 1);

    cacheTasks();

    return true;
  }

  function cacheTasks() {
    if (options.cache) {
      const directory = path.join(process.cwd(), ".botswarm");

      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
      }

      fs.writeFileSync(
        path.join(directory, "cache.txt"),
        JSON.stringify(tasks)
      );
    }
  }

  return {
    tasks: () => tasks,
    addTask,
    removeTask,
    cacheTasks,
  };
}
