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
      const identifier = parseTaskIdentifier(task);

      log.active(`Executing task ${identifier}`);

      const client = executorConfig.clients[task.execute.chain];

      const { baseFeePerGas } = await client.getBlock();

      if (!baseFeePerGas) {
        throw new Error("Failed to retrieve base fee from block");
      }

      console.log("baseFee", baseFeePerGas);

      const priorityFee =
        task.execute.maxBaseFeeForPriority === 0
          ? parseGwei(`${Number(task.execute.priorityFee)}`)
          : baseFeePerGas >
            parseGwei(`${Number(task.execute.maxBaseFeeForPriority)}`)
          ? 0n
          : parseGwei(`${Number(task.execute.priorityFee)}`);

      console.log("priorityFee", priorityFee);

      const hash = await write({
        contract: task.execute.contract,
        chain: task.execute.chain as any,
        functionName: task.execute.functionName,
        args: task.execute.args as any,
        maxPriorityFeePerGas: priorityFee,
        maxFeePerGas: baseFeePerGas + priorityFee + 5n,
        value: task.execute.value,
      });

      if (!hash) {
        throw new Error("Failed to execute task");
      }

      console.log("hash", hash);

      log.active(`Waiting for transaction receipt`);

      if (task.execute.chain !== "zkSync") {
        const receipt = await client.waitForTransactionReceipt({
          hash,
          timeout: 120_000,
        });

        log.active(`Checking statuss`);

        if (receipt.status === "reverted") {
          log.error(`Task reverted with an unknown reason. Hash: ${hash}`);
        }
      }

      log.success(`Task ${identifier} executed sucessfully`);

      return true;
    } catch (e) {
      executing[task.id] = false;

      log.error("Task execution error:");
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
      log.active(`Preparing to write to contract`);

      const client = executorConfig.clients[config.chain as string];
      const wallet = executorConfig.wallets[config.chain as string];

      const { deployments, abi } = executorConfig.contracts[config.contract];

      log.active(`Estimating gas limit`);

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

      log.active(`Running simulation`);

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

      log.active(`Writing to contract`);

      return wallet.writeContract(request);
    } catch (e) {
      log.error("Contract write error:");
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
    setExecuting: (id: string, value: boolean) => (executing[id] = value),
    write,
  };
}
