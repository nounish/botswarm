import { describe, expect, it } from "vitest";
import { sepolia } from "viem/chains";
import BotSwarm, { Task } from "./BotSwarm";
import { createHash } from "crypto";

describe("BotSwarm", () => {
  const { tasks, addTask, removeTask } = BotSwarm({ cache: false });

  const task: Omit<Task, "id"> = {
    chain: sepolia.network,
    block: 0,
    execute: "doNothing",
  };

  const id = createHash("sha256").update(JSON.stringify(task)).digest("hex");

  it("should schedule a task", () => {
    addTask(task);

    expect(tasks()).toContainEqual({ id, ...task });
  });

  it("should remove a task", () => {
    removeTask(id);

    expect(tasks()).not.toContainEqual({ id, ...task });
  });
});
