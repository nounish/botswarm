import { describe, expect, it } from "vitest";
import BotSwarm from "./index.js";

describe("BotSwarm", () => {
  const { Ethereum, Farcaster } = BotSwarm({ log: false });

  const { tasks, addTask, getTask, rescheduleTask, removeTask } = Ethereum({
    contracts: {
      TestContract: {
        abi: [
          {
            type: "function",
            name: "testFunction",
            stateMutability: "nonpayable",
            inputs: [],
            outputs: [],
          },
        ] as const,
        deployments: {
          sepolia: "0x0000000000000000000000000000000000000000",
        },
      },
    },
    privateKey: process.env.ETHEREUM_PRIVATE_KEY as string,
    cacheTasks: false,
  });

  const task = {
    block: 99999999999999999999n,
    contract: "TestContract",
    chain: "sepolia",
    functionName: "testFunction",
  } as const;

  it("Should schedule a task", () => {
    const success = addTask(task);
    expect(success).toBe(true);
    expect(tasks().length).toBe(1);
  });

  it("Should get a task", () => {
    const _task = tasks()[0];
    const task = getTask(_task.id);
    expect(task).toBeDefined();
    expect(task).toBe(_task);
  });

  it("Should not duplicate a task", () => {
    const success = addTask(task);
    expect(success).toBe(false);
    expect(tasks().length).toBe(1);
  });

  it("Should reschedule a task", () => {
    const success = rescheduleTask(tasks()[0].id, tasks()[0].block + 5n);
    expect(success).toBe(true);
    expect(tasks()[0].block).toBe(99999999999999999999n + 5n);
  });

  it("Should remove a task", () => {
    const success = removeTask(tasks()[0].id);
    expect(success).toBe(true);
    expect(tasks().length).toBe(0);
  });
});
