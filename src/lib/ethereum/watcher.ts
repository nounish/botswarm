import type {
  ExtractAbiFunctionNames,
  ExtractAbiEventNames,
  ExtractAbiEvents,
  ExtractAbiFunction,
  AbiParametersToPrimitiveTypes,
  AbiEvent,
} from "abitype";
import type { Address, Log, ReadContractReturnType } from "viem";
import type { MaybeAbiEventName } from "viem/_types/types/contract.js";
import type { Contract, EthereumChains, EthereumClient } from ".";

type OnBlockCallback = (block: bigint) => void;

type ExtractEvent<TEvents, TName> = TEvents extends { name: TName }
  ? TEvents
  : never;

export default function watcher<
  TContracts extends Record<string, Contract>
>(watcherConfig: {
  contracts: TContracts;
  clients: Record<string, EthereumClient>;
}) {
  let onBlockListeners: Record<string, OnBlockCallback[]> = {};

  function onBlock(chain: string, callback: OnBlockCallback) {
    if (!onBlockListeners[chain]) onBlockListeners[chain] = [];
    onBlockListeners[chain].push(callback);
  }
  type DefinitelyDefined<T> = {
    [K in keyof T]-?: Exclude<T[K], undefined>;
  };
  function watch<
    TContract extends keyof TContracts,
    TChain extends keyof TContracts[TContract]["deployments"],
    TEventName extends ExtractAbiEventNames<TContracts[TContract]["abi"]>,
    TEvent extends ExtractEvent<
      ExtractAbiEvents<TContracts[TContract]["abi"]>,
      TEventName
    >,
    TLog extends Log<
      bigint,
      number,
      false,
      TEvent,
      undefined,
      TEvent extends AbiEvent ? [TEvent] : undefined,
      MaybeAbiEventName<TEvent>
    >
  >(
    config: {
      contract: TContract;
      chain: TChain;
      event: TEventName;
    },
    callback: (
      log: Omit<TLog, "args"> & {
        args: DefinitelyDefined<TLog["args"]>;
      }
    ) => void
  ) {
    const client = watcherConfig.clients[config.chain as string];
    const { deployments, abi } = watcherConfig.contracts[config.contract];

    client.watchEvent({
      address: deployments[config.chain as EthereumChains] as Address,
      event: abi.find(
        (item) => item.type === "event" && item.name === config.event
      ) as TEvent,
      onLogs: (logs) => {
        for (const log of logs) {
          /*
            According to typescript, these two types are not the same...   
            - Log<bigint, number, false, TEvent, undefined, TEvent extends AbiEvent ? [TEvent] : undefined, MaybeAbiEventName<TEvent>>
            - Log<bigint, number, false, TEvent, undefined, TEvent extends AbiEvent ? [TEvent] : undefined, MaybeAbiEventName<TEvent>>
          */
          // @ts-ignore
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
    const client = watcherConfig.clients[config.chain as string];
    const { deployments, abi } = watcherConfig.contracts[config.contract];

    return client.readContract({
      address: deployments[config.chain as EthereumChains] as Address,
      abi,
      functionName: config.functionName as string,
      args: config.args as any,
    }) as Promise<
      ReadContractReturnType<TContracts[TContract]["abi"], TFunctionName>
    >;
  }

  for (const [chain, client] of Object.entries(watcherConfig.clients)) {
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
