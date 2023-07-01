import { Task } from "./scheduler";
import { ExtractAbiFunctionNames } from "abitype";
import { Chain, Contract, Wallet, Client } from "../utils/createConfig";
import { ValueOf } from "viem/dist/types/types/utils";
import { Address } from "viem";

export default function executor<TContracts extends Record<string, Contract>>(
  contracts: TContracts,
  clients: Record<string, Client>,
  wallets: Record<string, Wallet>
) {
  let executing: Record<string, boolean> = {};

  async function execute(task: Task) {
    try {
      executing[task.id] = true;
    } catch (error) {
      console.log(error);
    }
  }

  async function write<
    TContract extends ValueOf<typeof contracts>,
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
    });

    return wallet.writeContract(request);
  }

  return {
    execute,
    executing: () => executing,
    write,
  };
}
