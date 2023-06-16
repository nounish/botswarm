import { describe, expect, it } from "vitest";
import scheduler from "./scheduler";
import logger from "./logger";
import { sepolia } from "viem/chains";

const { tasks, addTask, removeTask } = scheduler(logger("", { testing: true }));

describe("scheduler", () => {
  const task = {
    id: "test:1",
    chain: sepolia.network,
    block: 0n,
    execute: async () => true,
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
