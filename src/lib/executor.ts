import { Task } from "./scheduler.js";
import {
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";
import { Chain, Contract, Wallet, Client } from "../utils/createConfig.js";
import { Address } from "viem";
import { active, colors, error, success } from "./logger.js";
import parseTaskIdentifier from "../utils/parseTaskIdentifier.js";

export default function executor<TContracts extends Record<string, Contract>>(
  contracts: TContracts,
  clients: Record<string, Client>,
  wallets: Record<string, Wallet>
) {
  let executing: Record<string, boolean> = {};

  async function execute(task: Task) {
    const identifier = parseTaskIdentifier(
      task.execute.contract,
      task.execute.functionName,
      task.id
    );

    active(`Executing task ${identifier}`);

    try {
      executing[task.id] = true;

      // @ts-ignore
      const hash = await write(task.execute);

      const receipt = await clients[
        task.execute.chain
      ].waitForTransactionReceipt({ hash });

      if (receipt.status === "reverted") {
        error(`
        Task ${identifier} reverted: {
          hash: ${colors.magenta(receipt.transactionHash)},
          chain: ${colors.magenta(task.execute.chain)},
          block: ${colors.magenta(Number(receipt.blockNumber))},
          contract: ${colors.magenta(
            contracts[task.execute.contract].deployments[
              task.execute.chain
            ] as string
          )},
          function: ${colors.magenta(task.execute.functionName)},
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
  }) {
    const client = clients[config.chain as string];
    const wallet = wallets[config.chain as string];

    const { deployments, abi } = contracts[config.contract];

    const { baseFeePerGas } = await client.getBlock();

    if (!baseFeePerGas) {
      throw new Error("Failed to retrieve base fee from block");
    }

    const priorityFee = baseFeePerGas / 2n;

    const { request } = await client.simulateContract({
      account: wallet.account,
      address: deployments[config.chain as Chain] as Address,
      abi,
      functionName: config.functionName as string,
      args: config.args as any,
      maxPriorityFeePerGas: priorityFee,
      maxFeePerGas: baseFeePerGas + priorityFee,
    });

    return wallet.writeContract(request);
  }

  return {
    execute,
    executing: () => executing,
    write,
  };
}
