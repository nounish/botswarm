import { describe, expect, it } from "vitest";
import { sepolia } from "viem/chains";
import BotSwarm from "./BotSwarm";

const { tasks, addTask, removeTask } = BotSwarm();

describe("BotSwarm", () => {
  const task = {
    id: "test:1",
    chain: sepolia.network,
    block: 0n,
    execute: async () => "",
  };

  it("should schedule a task", () => {
    addTask(task);

    expect(tasks()).toContainEqual({ ...task, isExecuting: false });
  });

  it("should remove a task", () => {
    removeTask(task.id);

    expect(tasks()).not.toContainEqual(task);
  });
});
