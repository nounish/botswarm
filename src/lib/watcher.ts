import { Client, Contract, Chain } from "../utils/createConfig.js";
import {
  ExtractAbiFunctionNames,
  ExtractAbiEventNames,
  ExtractAbiEvents,
  ExtractAbiFunction,
  AbiParametersToPrimitiveTypes,
} from "abitype";
import { Address, Log, ReadContractReturnType } from "viem";

type OnBlockCallback = (block: bigint) => void;

type ExtractEvent<TEvents, TName> = TEvents extends { name: TName }
  ? TEvents
  : never;

export default function watcher<TContracts extends Record<string, Contract>>(
  contracts: TContracts,
  clients: Record<string, Client>
) {
  let onBlockListeners: Record<string, OnBlockCallback[]> = {};

  function onBlock(chain: string, callback: OnBlockCallback) {
    if (!onBlockListeners[chain]) onBlockListeners[chain] = [];
    onBlockListeners[chain].push(callback);
  }

  function watch<
    TContract extends keyof TContracts,
    TChain extends keyof TContracts[TContract]["deployments"],
    TEventName extends ExtractAbiEventNames<TContracts[TContract]["abi"]>
  >(
    config: {
      contract: TContract;
      chain: TChain;
      event: TEventName;
    },
    callback: (
      log: Log<
        bigint,
        number,
        ExtractEvent<
          ExtractAbiEvents<TContracts[TContract]["abi"]>,
          TEventName
        >,
        undefined,
        [
          ExtractEvent<
            ExtractAbiEvents<TContracts[TContract]["abi"]>,
            TEventName
          >
        ]
      >
    ) => void
  ) {
    const client = clients[config.chain as string];
    const { deployments, abi } = contracts[config.contract];

    client.watchEvent({
      address: deployments[config.chain as Chain] as Address,
      event: abi.find(
        (item) => item.type === "event" && item.name === config.event
      ) as ExtractEvent<
        ExtractAbiEvents<TContracts[TContract]["abi"]>,
        TEventName
      >,
      onLogs: (logs) => {
        for (const log of logs) {
          callback(log);
        }
      },
    });
  }

  async function read<
    TContract extends keyof TContracts,
    TChain extends keyof TContracts[TContract]["deployments"],
    TFunctionName extends ExtractAbiFunctionNames<
      TContracts[TContract]["abi"],
      "view" | "pure"
    >,
    TArgs extends AbiParametersToPrimitiveTypes<
      ExtractAbiFunction<TContracts[TContract]["abi"], TFunctionName>["inputs"]
    >
  >(config: {
    contract: TContract;
    chain: TChain;
    functionName: TFunctionName;
    args?: TArgs;
  }) {
    const client = clients[config.chain as string];
    const { deployments, abi } = contracts[config.contract];

    return client.readContract({
      address: deployments[config.chain as Chain] as Address,
      abi,
      functionName: config.functionName as string,
      args: config.args as any,
    }) as Promise<
      ReadContractReturnType<TContracts[TContract]["abi"], TFunctionName>
    >;
  }

  for (const [chain, client] of Object.entries(clients)) {
    client.watchBlockNumber({
      onBlockNumber: async (block) => {
        for (const blockListener of onBlockListeners[chain]) {
          blockListener(block);
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
