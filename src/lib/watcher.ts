import { ValueOf } from "viem/dist/types/types/utils";
import { Chains, contracts } from "../../botswarm.config";
import logger from "./logger";

export default function watcher(log: ReturnType<typeof logger>) {
  function watch(
    contract: ValueOf<(typeof contracts)[Chains]>,
    event: keyof typeof contract.watchEvent,
    callback: (
      e: Parameters<
        Parameters<(typeof contract.watchEvent)[typeof event]>[1]["onLogs"]
      >[0][number] & { blockNumber: bigint }
    ) => void
  ) {
    contract.watchEvent[event](
      {},
      {
        onLogs: (events) => {
          for (const e of events) {
            if (e.blockNumber) {
              callback(e as typeof e & { blockNumber: bigint });
            }
          }
        },
      }
    );
  }

  return {
    watch,
  };
}
