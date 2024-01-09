import { parseGwei, BaseError, ContractFunctionRevertedError } from "viem";
import parseTaskIdentifier from "../../utils/parseTaskIdentifier.js";
import type {
  Contract,
  EthereumChains,
  EthereumClient,
  EthereumWallet,
} from "./index.js";
import type { Task } from "./scheduler.js";
import type {
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";
import type { Address } from "viem";
import { Logger, colors } from "../logger.js";

export default function executor<TContracts extends Record<string, Contract>>(
  executorConfig: {
    contracts: TContracts;
    clients: Record<string, EthereumClient>;
    wallets: Record<string, EthereumWallet>;
    gasLimitBuffer: number | bigint;
  },
  log: Logger
) {
  let executing: Record<string, boolean> = {};

  async function execute(task: Task) {
    try {
      executing[task.id] = true;

      const identifier = parseTaskIdentifier(task);

      log.active(`Executing task ${identifier}`);

      const client = executorConfig.clients[task.execute.chain];

      const { baseFeePerGas } = await client.getBlock();

      if (!baseFeePerGas) {
        throw new Error("Failed to retrieve base fee from block");
      }

      const priorityFee =
        task.execute.maxBaseFeeForPriority === 0
          ? parseGwei(`${Number(task.execute.priorityFee)}`)
          : baseFeePerGas >
            parseGwei(`${Number(task.execute.maxBaseFeeForPriority)}`)
          ? 0n
          : parseGwei(`${Number(task.execute.priorityFee)}`);

      const hash = await write({
        contract: task.execute.contract,
        chain: task.execute.chain as any,
        functionName: task.execute.functionName,
        args: task.execute.args as any,
        maxPriorityFeePerGas: priorityFee,
        maxFeePerGas: baseFeePerGas + priorityFee,
        value: task.execute.value,
      });

      if (!hash) {
        throw new Error("Failed to execute task");
      }

      const receipt = await client.waitForTransactionReceipt({
        hash,
        timeout: 120_000,
      });

      if (receipt.status === "reverted") {
        log.error(`
        Task ${identifier} reverted: {
          hash: ${colors.magenta(receipt.transactionHash)},
          chain: ${colors.magenta(task.execute.chain)},
          block: ${colors.magenta(Number(receipt.blockNumber))},
          contract: ${colors.magenta(
            executorConfig.contracts[task.execute.contract].deployments[
              task.execute.chain
            ] as string
          )},
          function: ${colors.magenta(task.execute.functionName)},
        }        
        `);
      }

      log.success(`Task ${identifier} executed sucessfully`);

      return true;
    } catch (e) {
      executing[task.id] = false;

      log.error(e as string);

      return false;
    }
  }

  async function write<
    TContract extends keyof TContracts,
    TChain extends keyof TContracts[TContract]["deployments"],
    TFunctionName extends ExtractAbiFunctionNames<
      TContracts[TContract]["abi"],
      "payable" | "nonpayable"
    >,
    TArgs extends AbiParametersToPrimitiveTypes<
      ExtractAbiFunction<TContracts[TContract]["abi"], TFunctionName>["inputs"]
    >
  >(config: {
    contract: TContract;
    chain: TChain;
    functionName: TFunctionName;
    args?: TArgs;
    maxPriorityFeePerGas?: bigint | number;
    maxFeePerGas?: bigint | number;
    gasLimit?: bigint | number;
    value?: bigint | number;
  }) {
    try {
      const client = executorConfig.clients[config.chain as string];
      const wallet = executorConfig.wallets[config.chain as string];

      const { deployments, abi } = executorConfig.contracts[config.contract];

      const gasLimit =
        config.gasLimit ??
        (await client.estimateContractGas({
          address: deployments[config.chain as EthereumChains] as Address,
          abi,
          functionName: config.functionName as string,
          args: config.args as any,
          maxPriorityFeePerGas: config.maxPriorityFeePerGas
            ? BigInt(config.maxPriorityFeePerGas)
            : undefined,
          maxFeePerGas: config.maxFeePerGas
            ? BigInt(config.maxFeePerGas)
            : undefined,
          account: wallet.account,
        }));

      const { request } = await client.simulateContract({
        account: wallet.account,
        address: deployments[config.chain as EthereumChains] as Address,
        abi,
        functionName: config.functionName as string,
        args: config.args as any,
        maxPriorityFeePerGas: config.maxPriorityFeePerGas
          ? BigInt(config.maxPriorityFeePerGas)
          : undefined,
        maxFeePerGas: config.maxFeePerGas
          ? BigInt(config.maxFeePerGas)
          : undefined,
        gas: BigInt(gasLimit) + BigInt(executorConfig.gasLimitBuffer),
        value: config.value ? BigInt(config.value) : undefined,
      });

      return wallet.writeContract(request);
    } catch (e) {
      if (
        e instanceof BaseError &&
        e.cause instanceof ContractFunctionRevertedError
      ) {
        log.error(`${e.cause.data?.errorName}: ${e.cause.message}`);
      } else log.error(e as string);
    }
  }

  return {
    execute,
    executing: () => executing,
    write,
  };
}
