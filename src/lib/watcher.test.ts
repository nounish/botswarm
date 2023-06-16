import { describe, expect, it } from "vitest";
import logger from "./logger";
import watcher from "./watcher";
import { contracts } from "../../botswarm.config";

const { watch } = watcher(logger("", { testing: true }));

describe("watcher", () => {
  it("should watch event", () => {
    watch(contracts.sepolia.NounsPool, "BidPlaced", (event) => {
      expect(event).toBeDefined();
    });
  });
});
