import { Task } from "./scheduler.js";
import {
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";
import { Chain, Contract, Wallet, Client } from "../utils/createConfig.js";
import {
  Address,
  BaseError,
  ContractFunctionRevertedError,
  parseGwei,
} from "viem";
import { active, colors, error, success } from "./logger.js";
import parseTaskIdentifier from "../utils/parseTaskIdentifier.js";

export default function executor<TContracts extends Record<string, Contract>>(
  contracts: TContracts,
  clients: Record<string, Client>,
  wallets: Record<string, Wallet>,
  options: { gasLimitBuffer: number | bigint }
) {
  let executing: Record<string, boolean> = {};

  async function execute(task: Task) {
    try {
      executing[task.id] = true;

      const identifier = parseTaskIdentifier(task);

      active(`Executing task ${identifier}`);

      const client = clients[task.chain];

      const { baseFeePerGas } = await client.getBlock();

      if (!baseFeePerGas) {
        throw new Error("Failed to retrieve base fee from block");
      }

      const priorityFee =
        task.maxBaseFeeForPriority === 0
          ? parseGwei(`${Number(task.priorityFee)}`)
          : baseFeePerGas > parseGwei(`${Number(task.maxBaseFeeForPriority)}`)
          ? 0n
          : parseGwei(`${Number(task.priorityFee)}`);

      const hash = await write({
        contract: task.contract,
        chain: task.chain,
        functionName: task.functionName,
        args: task.args as any,
        maxPriorityFeePerGas: priorityFee,
        maxFeePerGas: baseFeePerGas + priorityFee,
      });

      if (!hash) {
        throw new Error("Failed to execute task");
      }

      const receipt = await client.waitForTransactionReceipt({ hash });

      if (receipt.status === "reverted") {
        error(`
        Task ${identifier} reverted: {
          hash: ${colors.magenta(receipt.transactionHash)},
          chain: ${colors.magenta(task.chain)},
          block: ${colors.magenta(Number(receipt.blockNumber))},
          contract: ${colors.magenta(
            contracts[task.contract].deployments[task.chain] as string
          )},
          function: ${colors.magenta(task.functionName)},
        }        
        `);
      }

      success(`Task ${identifier} executed sucessfully`);

      return true;
    } catch (e) {
      executing[task.id] = false;

      error(e as string);

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
  }) {
    try {
      const client = clients[config.chain as string];
      const wallet = wallets[config.chain as string];

      const { deployments, abi } = contracts[config.contract];

      const gasLimit =
        config.gasLimit ??
        (await client.estimateContractGas({
          address: deployments[config.chain as Chain] as Address,
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
        address: deployments[config.chain as Chain] as Address,
        abi,
        functionName: config.functionName as string,
        args: config.args as any,
        maxPriorityFeePerGas: config.maxPriorityFeePerGas
          ? BigInt(config.maxPriorityFeePerGas)
          : undefined,
        maxFeePerGas: config.maxFeePerGas
          ? BigInt(config.maxFeePerGas)
          : undefined,
        gas: BigInt(gasLimit) + BigInt(options.gasLimitBuffer),
      });

      return wallet.writeContract(request);
    } catch (e) {
      if (
        e instanceof BaseError &&
        e.cause instanceof ContractFunctionRevertedError
      ) {
        error(`${e.cause.data?.errorName}: ${e.cause.message}`);
      } else error(e as string);
    }
  }

  return {
    execute,
    executing: () => executing,
    write,
  };
}
