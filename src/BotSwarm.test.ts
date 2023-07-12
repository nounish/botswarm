import { describe, expect, it } from "vitest";
import BotSwarm from "./index.js";

describe("BotSwarm", () => {
  const { tasks, addTask, rescheduleTask, removeTask } = BotSwarm(
    {
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
    { cache: false, log: false }
  );

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

  it("Should not duplicate a task", () => {
    const success = addTask(task);
    expect(success).toBe(false);
    expect(tasks().length).toBe(1);
  });

  it("Should reschedule a task", () => {
    const success = rescheduleTask(tasks()[0].id);
    expect(success).toBe(true);
    expect(tasks()[0].block).toBe(99999999999999999999n + 5n);
  });

  it("Should remove a task", () => {
    const success = removeTask(tasks()[0].id);
    expect(success).toBe(true);
    expect(tasks().length).toBe(0);
  });
});
