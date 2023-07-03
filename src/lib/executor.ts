import { Task } from "./scheduler.js";
import { ExtractAbiFunctionNames } from "abitype";
import { Chain, Contract, Wallet, Client } from "../utils/createConfig.js";
import { Address } from "viem";
import { active, colors, error, success } from "./logger.js";

export default function executor<TContracts extends Record<string, Contract>>(
  contracts: TContracts,
  clients: Record<string, Client>,
  wallets: Record<string, Wallet>
) {
  let executing: Record<string, boolean> = {};

  async function execute(task: Task) {
    active(`Executing task: ${colors.blue(task.execute.functionName)}`);

    try {
      executing[task.id] = true;
      // @ts-ignore
      const hash = await write(task.execute);

      const receipt = await clients[
        task.execute.chain
      ].waitForTransactionReceipt({ hash });

      if (receipt.status === "reverted") {
        error(`
        Task ${colors.blue(task.execute.functionName)} reverted: {
          hash: ${colors.magenta(receipt.transactionHash)},
          chain: ${colors.magenta(task.execute.chain)},
          block: ${colors.magenta(Number(receipt.blockNumber))},
          contract: ${colors.magenta(task.execute.contract)},
          function: ${colors.magenta(task.execute.functionName)},
        }        
        `);
      }

      success(
        `Task executed sucessfully: ${colors.blue(task.execute.functionName)}`
      );

      return true;
    } catch (e) {
      executing[task.id] = false;

      error(e as string);

      return false;
    }
  }

  async function write<
    TContract extends (typeof contracts)[keyof typeof contracts],
    TChain extends keyof TContract["deployments"],
    TFunctionName extends ExtractAbiFunctionNames<
      TContract["abi"],
      "payable" | "nonpayable"
    >
  >(config: {
    contract: TContract;
    chain: TChain;
    functionName: TFunctionName;
  }) {
    const client = clients[config.chain as string];
    const wallet = wallets[config.chain as string];

    const { request } = await client.simulateContract({
      account: wallet.account,
      address: config.contract.deployments[config.chain as Chain] as Address,
      abi: config.contract.abi,
      functionName: config.functionName as string,
      maxPriorityFeePerGas: (await client.getGasPrice()) / 2n,
    });

    return wallet.writeContract(request);
  }

  return {
    execute,
    executing: () => executing,
    write,
  };
}
