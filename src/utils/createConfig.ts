import {
  Abi,
  Address,
  GetContractReturnType,
  HttpTransport,
  PrivateKeyAccount,
  PublicClient,
  WalletClient,
  createPublicClient,
  createWalletClient,
  getContract,
  http,
  Chain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import env from "dotenv";
env.config();

type Contract = {
  readonly abi: Abi;
  readonly deployments: Array<{
    readonly chain: Chain;
    readonly address: Address;
  }>;
};

type Clients<TContracts extends Record<string, Contract>> = {
  [Deployment in TContracts[keyof TContracts]["deployments"][number] as Deployment["chain"]["network"]]: PublicClient<
    HttpTransport,
    Deployment["chain"]
  >;
};

type Wallets<TContracts extends Record<string, Contract>> = {
  [Deployment in TContracts[keyof TContracts]["deployments"][number] as Deployment["chain"]["network"]]: WalletClient<
    HttpTransport,
    Deployment["chain"],
    PrivateKeyAccount
  >;
};

type Contracts<
  TContracts extends Record<string, Contract>,
  TClients extends Clients<TContracts>,
  TWallets extends Wallets<TContracts>
> = {
  [TContract in keyof TContracts]: {
    [TDeployment in TContracts[TContract]["deployments"][number] as TDeployment["chain"]["network"]]: GetContractReturnType<
      TContracts[TContract]["abi"],
      TClients[TDeployment["chain"]["network"]],
      TWallets[TDeployment["chain"]["network"]],
      TDeployment["address"]
    >;
  };
};

export default function createConfig<
  TContracts extends Record<string, Contract>
>(rpc: Record<string, string>, contracts: TContracts) {
  let clients = {} as Record<string, PublicClient<HttpTransport, Chain>>;
  let wallets = {} as Record<
    string,
    WalletClient<HttpTransport, Chain, PrivateKeyAccount>
  >;

  for (const contract of Object.values(contracts)) {
    for (const deployment of contract.deployments) {
      clients[deployment.chain.network] = createPublicClient({
        transport: http(rpc[deployment.chain.network]),
        chain: deployment.chain,
      });

      wallets[deployment.chain.network] = createWalletClient({
        account: privateKeyToAccount(process.env.PRIVATE_KEY as Address),
        chain: deployment.chain,
        transport: http(rpc[deployment.chain.network]),
      });
    }
  }

  let contractInstances = {} as Record<string, Record<string, unknown>>;

  for (const [name, contract] of Object.entries(contracts)) {
    contractInstances[name] = {} as Record<string, unknown>;
    for (const deployment of contract.deployments) {
      contractInstances[name][deployment.chain.network] = getContract({
        address: deployment.address,
        abi: contract.abi,
        publicClient: clients[deployment.chain.network],
        walletClient: wallets[deployment.chain.network],
      });
    }
  }

  return {
    clients,
    wallets,
    contracts: contractInstances,
  } as {
    clients: Clients<TContracts>;
    wallets: Wallets<TContracts>;
    contracts: Contracts<TContracts, Clients<TContracts>, Wallets<TContracts>>;
  };
}
