import { ValueOf } from "viem/dist/types/types/utils";
import { Client, Contract, Chain } from "../utils/createConfig";
import {
  ExtractAbiFunctionNames,
  ExtractAbiEventNames,
  ExtractAbiEvents,
} from "abitype";
import { Address, Log, ReadContractReturnType } from "viem";

type OnBlockCallback = (chain: string, block: number) => void;

type ExtractEvent<TEvents, TName> = TEvents extends { name: TName }
  ? TEvents
  : never;

export default function watcher<TContracts extends Record<string, Contract>>(
  contracts: TContracts,
  clients: Record<string, Client>
) {
  let onBlockListeners: Record<string, OnBlockCallback[]> = {};

  function onBlock(chain: string, callback: OnBlockCallback) {
    onBlockListeners[chain].push(callback);
  }

  function watch<
    TContract extends ValueOf<typeof contracts>,
    TChain extends keyof TContract["deployments"],
    TEventName extends ExtractAbiEventNames<TContract["abi"]>
  >(config: {
    contract: TContract;
    chain: TChain;
    event: TEventName;
    callback: (
      log: Log<
        bigint,
        number,
        ExtractEvent<ExtractAbiEvents<TContract["abi"]>, TEventName>,
        undefined,
        [ExtractEvent<ExtractAbiEvents<TContract["abi"]>, TEventName>]
      >
    ) => void;
  }) {
    const client = clients[config.chain as string];

    client.watchEvent({
      address: config.contract.deployments[config.chain as Chain] as Address,
      event: config.contract.abi.find(
        (item) => item.type === "event" && item.name === config.event
      ) as ExtractEvent<ExtractAbiEvents<TContract["abi"]>, TEventName>,
      onLogs: (logs) => {
        for (const log of logs) {
          config.callback(log);
        }
      },
    });
  }

  async function read<
    TContract extends ValueOf<typeof contracts>,
    TChain extends keyof TContract["deployments"],
    TFunctionName extends ExtractAbiFunctionNames<
      TContract["abi"],
      "view" | "pure"
    >
  >(config: {
    contract: TContract;
    chain: TChain;
    functionName: TFunctionName;
  }) {
    const client = clients[config.chain as string];

    return client.readContract({
      address: config.contract.deployments[config.chain as Chain] as Address,
      abi: config.contract.abi,
      functionName: config.functionName as string,
    }) as Promise<ReadContractReturnType<TContract["abi"], TFunctionName>>;
  }

  for (const [chain, client] of Object.entries(clients)) {
    client.watchBlockNumber({
      onBlockNumber: async (block) => {
        for (const blockListener of onBlockListeners[chain]) {
          blockListener(chain, Number(block));
        }
      },
    });
  }

  return {
    onBlock,
    watch,
    read,
  };
}
