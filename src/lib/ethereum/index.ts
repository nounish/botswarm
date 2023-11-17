import { createWalletClient, createPublicClient, http } from "viem";
import type {
  Abi,
  Address,
  Chain,
  HttpTransport,
  PrivateKeyAccount,
  PublicClient,
  WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as chains from "viem/chains";
import type _ from "viem/node_modules/abitype";
import { BotSwarmConfig } from "../../BotSwarm";
import { Logger } from "../logger";
import scheduler, { Task } from "./scheduler";
import executor from "./executor";
import watcher from "./watcher";
import { Cacher } from "../cacher";

export type EthereumClient = PublicClient<HttpTransport, Chain>;

export type EthereumWallet = WalletClient<
  HttpTransport,
  Chain,
  PrivateKeyAccount
>;

export type EthereumChains = keyof typeof chains;

export type Contract = {
  readonly abi: Abi;
  readonly deployments: {
    [TChain in EthereumChains]?: Address;
  };
};

export type Hook = (task: Task, block: bigint) => Promise<Task>;

export type EthereumConfig<TContracts> = {
  contracts: TContracts;
  privateKey: string;
  hooks: Record<string, Hook>;
  rpcs: { [TChain in EthereumChains]?: string };
  gasLimitBuffer: number;
  blockExecutionBuffer: number;
  cacheTasks: boolean;
};

export default function createEthereum(
  botswarmConfig: BotSwarmConfig,
  log: Logger,
  cacher: Cacher
) {
  return <TContracts extends Record<string, Contract>>(config: {
    contracts: EthereumConfig<TContracts>["contracts"];
    privateKey: EthereumConfig<TContracts>["privateKey"];
    hooks?: EthereumConfig<TContracts>["hooks"];
    rpcs?: EthereumConfig<TContracts>["rpcs"];
    gasLimitBuffer?: EthereumConfig<TContracts>["gasLimitBuffer"];
    blockExecutionBuffer?: EthereumConfig<TContracts>["blockExecutionBuffer"];
    cacheTasks?: EthereumConfig<TContracts>["cacheTasks"];
  }) => {
    const ethereumConfig = {
      rpcs: {
        mainnet: "https://rpc.flashbots.net/",
      },
      hooks: {},
      cacheTasks: true,
      gasLimitBuffer: 30000,
      blockExecutionBuffer: 0,
      ...config,
    } satisfies EthereumConfig<TContracts>;

    let clients = {} as Record<EthereumChains, EthereumClient>;
    let wallets = {} as Record<EthereumChains, EthereumWallet>;

    for (const contract in ethereumConfig.contracts) {
      for (const deployment in ethereumConfig.contracts[contract].deployments) {
        const rpc = ethereumConfig.rpcs[deployment as EthereumChains];

        clients[deployment as EthereumChains] = createPublicClient({
          transport: http(rpc),
          chain: chains[deployment as EthereumChains] as Chain,
        });

        if (!process.env.ETHEREUM_PRIVATE_KEY) {
          throw new Error(
            "ETHEREUM_PRIVATE_KEY environment variable is required to run BotSwarm, see: https://github.com/nounish/botswarm/tree/main#configuration"
          );
        }

        wallets[deployment as EthereumChains] = createWalletClient({
          account: privateKeyToAccount(
            process.env.ETHEREUM_PRIVATE_KEY as Address
          ),
          chain: chains[deployment as EthereumChains] as Chain,
          transport: http(rpc),
        });
      }
    }

    const {
      tasks,
      rescheduled,
      addTask,
      getTask,
      removeTask,
      rescheduleTask,
      cacheTasks,
    } = scheduler(
      {
        contracts: config.contracts,
        hooks: ethereumConfig.hooks,
        cacheTasks: ethereumConfig.cacheTasks,
      },
      log,
      cacher
    );

    const { execute, executing, write } = executor(
      {
        contracts: config.contracts,
        clients,
        wallets,
        gasLimitBuffer: ethereumConfig.gasLimitBuffer,
      },
      log
    );

    const { onBlock, watch, read } = watcher({
      contracts: config.contracts,
      clients,
    });

    for (const chain in clients) {
      onBlock(chain, async (block) => {
        for (const task of tasks()) {
          if (
            task.chain === chain &&
            task.block <= block + BigInt(ethereumConfig.blockExecutionBuffer) &&
            !executing()[task.id]
          ) {
            let modifiedTask = task;

            for (const hook of task.hooks) {
              if (hook in ethereumConfig.hooks) {
                modifiedTask = await ethereumConfig.hooks[hook](
                  modifiedTask,
                  block
                );
              }
            }

            const success = await execute(modifiedTask);

            if (success) {
              removeTask(modifiedTask.id);
              continue;
            }

            if (rescheduled()[modifiedTask.id]) {
              removeTask(modifiedTask.id);
              continue;
            }

            rescheduleTask(modifiedTask.id, block + 5n, true);
          }
        }
      });
    }

    return {
      clients,
      wallets,
      contracts: config.contracts,

      // Scheduler
      tasks,
      rescheduled,
      addTask,
      getTask,
      removeTask,
      rescheduleTask,
      cacheTasks,

      // Executor
      execute,
      executing,
      write,

      // Watcher
      onBlock,
      watch,
      read,
    };
  };
}
