```
██████╗  ██████╗ ████████╗███████╗██╗    ██╗ █████╗ ██████╗ ███╗   ███╗
██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝██║    ██║██╔══██╗██╔══██╗████╗ ████║
██████╔╝██║   ██║   ██║   ███████╗██║ █╗ ██║███████║██████╔╝██╔████╔██║
██╔══██╗██║   ██║   ██║   ╚════██║██║███╗██║██╔══██║██╔══██╗██║╚██╔╝██║
██████╔╝╚██████╔╝   ██║   ███████║╚███╔███╔╝██║  ██║██║  ██║██║ ╚═╝ ██║
╚═════╝  ╚═════╝    ╚═╝   ╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
```

# Getting Started

BotSwarm is a typesafe library for scheduling onchain transactions. It also includes tools for creating [Farcaster](https://www.farcaster.xyz/) bots that can react to events emitted by smart contracts.

To get started you can 

- Clone [our implementation of BotSwarm](https://github.com/nounish/federation-bot)
- Check out some [examples](https://github.com/nounish/botswarm/blob/main/examples)
- Follow along with the documentation below

Documentation

- [Configuration](#configuration)
- [Usage](#usage) 
  - [Ethereum](#ethereum)
    - [Reacting to onchain events](#reacting-to-onchain-events)
    - [Read and writing to contracts](#read-and-writing-to-contracts)
    - [Scheduling tasks](#scheduling-tasks)
    - [Usage with Viem](#usage-with-viem)
  - [Farcaster](#farcaster)
    - [Casting](#casting)
    - [Reacting](#reacting)
    - [Update Profile](#update-profile)
- [Logging](#logging)
- [Full BotSwarm API](#full-botswarm-api)

## Installation

Create a new NPM project and run

```bash
npm i @federationwtf/botswarm
```

## Configuration

To initialize BotSwarm, simply call the BotSwarm function with an optional config.

```typescript
import BotSwarm from "@federationwtf/botswarm";

const bot = BotSwarm({
  /*** Optional (defaults) ***/
  log: true, // Log status updates to the terminal
});
```

## Usage

BotSwarm provides two adapters you can use, `Ethereum` and `Farcaster` each with their own platform specific actions

```typescript
const { Ethereum, Farcaster } = BotSwarm();
```

Check out [the full api](#full-botswarm-api) for all BotSwarm features

### Ethereum

The Ethereum adapter allows you to interact with contracts on any EVM compatible chain. When passing in the ABI you must declare it as const or it won't be typesafe. BotSwarm uses [Viem](https://viem.sh/) under the hood and the deployment networks are extended from it.

```typescript
const ethereum = Ethereum({
  /*** Required ***/
  contracts: {
    MyContract: { // The contract name
      abi: [...] as const, // The contract abi
      deployments: {
        mainnet: "0xA...A" // The network and address of the deployment 
      }
    },
  }
  privateKey: process.env.ETHEREUM_PRIVATE_KEY,

  /*** Optional (defaults) ***/
  cacheTasks: true, // Cache tasks to .botswarm/cache.json
  rps: { // Override public rpcs for clients and wallets
    mainnet: "https://rpc.flashbots.net",
  },
  gasLimitBuffer: 30000, // Increases the gas limit of a transaction by the buffer amount in gas units
  blockExecutionBuffer: 0 // Delays execution of all tasks by a certain number of blocks
});
```

We provide some premade contracts from [Federation](https://github.com/nounish/federation-protocol) and [Nouns](https://github.com/nounsDAO/nouns-monorepo/tree/master/packages/nouns-contracts)

```typescript
import BotSwarm from "@federationwtf/botswarm";
import {
  // Federation
  FederationNounsPool,

  // Nouns
  NounsDAOLogicV3,
  NounsAuctionHouse,
  NounsDAOExecutor,
  NounsDescriptor,
  NounsSeeder,
  NounsToken
} from "@federationwtf/botswarm/contracts";

const { Ethereum } = BotSwarm();

const ethereum = Ethereum({
  contracts: {
    FederationNounsPool,
    NounsDAOLogicV3,
    NounsAuctionHouse,
    NounsDAOExecutor,
    NounsDescriptor,
    NounsSeeder,
    NounsToken
  }
  privateKey: process.env.ETHEREUM_PRIVATE_KEY,
});
```

Check out [the full api](#full-botswarm-api) for all Ethereum features

#### Reacting to onchain events

To react to onchain events you can use `onBlock` or `watch`. 

The `onBlock` function takes in a chain and a callback which will be called on every new block.

The `watch` function takes in the contract name, chain, event name, and a callback. These values are typesafe and are derived from the contracts in the Ethereum configuration. Once a BidPlaced event is picked up BotSwarm will run the callback. The event object returned by the `watch` callback is a Viem [Log](https://viem.sh/docs/glossary/types.html#log).

```typescript 
const { onBlock, watch } = Ethereum({ 
  contracts: { FederationNounsPool }
});

onBlock("mainnet", async (block) => {
  console.log(`Current block: ${block}`);
})

watch({
  contract: "FederationNounsPool",
  chain: "mainnet",
  event: "BidPlaced",
}, async (event) => {
  console.log("A new bid was placed!");
})
```

#### Read and writing to contracts

The Ethereum adapter also returns a `read` and `write` function for abitrary contract calls. These are typesafe wrappers around Viem's `readContract` and `writeContract` functions.

```typescript 
const { read, write } = Ethereum({ 
  contracts: { FederationNounsPool }
});

const { castWindow } = await read({
  contract: "FederationNounsPool",
  chain: "mainnet",
  functionName: "getConfig",
});

const hash = await write({
  contract: "FederationNounsPool",
  chain: "mainnet",
  functionName: "castVote",
  args: [325]
});
```

The write function also includes gas related options that can be overriden for more control over the transaction.

```typescript
const hash = await write({
  contract: "FederationNounsPool",
  chain: "mainnet",
  functionName: "castVote",
  args: [325],
  maxPriorityFeePerGas: 10,
  maxFeePerGas: 30,
  gasLimit: 300000
});
```

#### Scheduling tasks

Tasks are specified contract calls to be executed after a given block. To add a task call `addTask` which takes in a block number contract call details which mimic the parameters of the `write` function used above. BotSwarm will watch the specified chain and call the `write` function when the current block is >= the block passed into `addTask`. Below is an example of [our implementation](https://github.com/nounish/federation-bot) of this to cast a FederationNounsPool vote result to NounsDAO before the proposal ends. 

If task execution fails then BotSwarm will make a second attempt and reschedule it a few blocks after. If the execution fails a second time then the task will be removed from the queue.

All tasks are cached to `.botswarm/cache.json` when added or removed. BotSwarm will load all cached tasks when restarted.

```typescript
import BotSwarm from "@federationwtf/botswarm";
import {   
  FederationNounsPool,
  NounsDAOLogicV3 
} from "@federationwtf/botswarm/contracts";

const { addTask, watch, read } = BotSwarm({
  FederationNounsPool,
  NounsDAOLogicV3
});

watch(
  { contract: "FederationNounsPool", chain: "mainnet", event: "BidPlaced" },
  async (event) => {
    if (!event.args.propId) return;

    const { castWindow } = await read({
      contract: "FederationNounsPool",
      chain: "mainnet",
      functionName: "getConfig",
    });

    const { endBlock } = await read({
      contract: "NounsDAOLogicV3",
      chain: "mainnet",
      functionName: "proposals",
      args: [event.args.propId],
    });

    addTask({
      block: endBlock - castWindow,
      contract: "FederationNounsPool",
      chain: "mainnet",
      functionName: "castVote",
      args: [event.args.propId],
    });
  }
);
```

Some usecases like MEV extraction might require that tasks execute as fast as possible. For situations like this you can specify the `priorityFee` (gwei) and `maxBaseFeeForPriority` (gwei) properties. If `maxBaseFeeForPriority` is less than the base fee at time of execution then BotSwarm will drop the `priorityFee` from the transaction. This is beneficial for scenarios where you still want the reliability of the transaction going through but also the ability to drop the priority fee if the base fee makes it unprofitable.

```typescript
addTask({
  block: endBlock - castWindow,
  contract: "FederationNounsPool",
  chain: "mainnet",
  functionName: "castVote",
  args: [event.args.propId],
  priorityFee: 10,
  maxBaseFeeForPriority: 25,
});
```

#### Usage with Viem

The BotSwarm Ethereum adapter uses Viem under the hood but it can be used directly by referencing the contracts object.

```typescript
import BotSwarm from "@federationwtf/botswarm";
import NounsPoolABI from "./contracts/NounsPool";
import { getContract } from "viem";

const { Ethereum } = BotSwarm()

const { contracts, clients, wallets } = Ethereum({
  NounsPool: {
    abi: NounsPoolABI,
    deployments: {
      mainnet: "0xBE5E6De0d0Ac82b087bAaA1d53F145a52EfE1642",
    },
  },
});

const NounsPool = getContract({
  address: contracts.NounsPool.deployments.mainnet.address,
  abi: NounsPoolABI,
  publicClient: clients.mainnet,
  walletClient: wallets.mainnet
})
```

### Farcaster

The Farcaster adapter is a native wrapper around [farcaster-js](https://github.com/standard-crypto/farcaster-js) making it incredibly easy to create [Farcaster](https://www.farcaster.xyz/) bots. 

```typescript
const farcaster = Farcaster({
  fid: 16074, // @federation
  signerPrivateKey: process.env.FARCASTER_PRIVATE_KEY,
  rpc: "hub.rpc.url:2283",
  network: "mainnet" // Optional - "mainnet" | "testnet" | "devnet" defaults to "mainnet"
});
```

Check out [the full api](#full-botswarm-api) for all Farcaster features

#### Casting

Automating casts to the Farcaster network is as easy as calling `cast` along with the text.

```typescript
const { cast, reply, removeCast} = Farcaster({ ... });

const post = await cast("Wow, BotSwarm is pretty cool!");

if (post) {
  const postReply = reply("Yeah, automating my Farcaster posts is super simple!", post);
}

const postInChannel = await cast("This casts to a channel", { channel: "channel" });
```

We provide some built in popular channels from [Warpcast](https://warpcast.com/).

```typescript
import { Nouns } from "@federationwtf/botswarm/channels";

const { cast } = Farcaster({ ... });

const postInChannel = await cast(
  "This casts to a channel", 
  { channel: Nouns }
);
```

#### Reacting

If a post was successful, you can react to it by providing the returned post object along with the reaction type.

```typescript
const { cast, react } = Farcaster({ ... });

const post = await cast("This is a post");

if (post) {
  react(post, "like");
  react(post, "recast");
}
```

#### Update Profile

To update your Farcaster profile you can call the updateProfile function and pass in any parameter you would like to change.

```typescript
const { updateProfile } = Farcaster({ ... });

updateProfile({
  pfp: "https://link.to/image"; // Optional
  displayName: "Display Name"; // Optional
  bio: "A bio for your Farcaster profile"; // Optional
  url: "https://some.url/"; // Optional
  username: "username"; // Optional
})
```

## Logging

If you would like to log custom data to the terminal you can import `success`, `warn`, `error`, and/or `active` which each take in a string. 

```typescript
import BotSwarm from "@federationwtf/botswarm";

const { log } = BotSwarm();

log.success("This is a success!") // Will prepend with a green checkmark
log.warn("This is a warning.") // Will prepend with a warning symbol
log.error("This is probably bad.") // Will prepend with a red x
log.active("Doing something") // Will change the spinner to blue
```

## Full BotSwarm API

Below is a complete example of all of the components you can use to add advanced functionality to your bot.

```typescript
import BotSwarm from "@federationwtf/botswarm";

const { 
  Ethereum, // Ethereum adapter
  Farcaster, // Farcaster adapter
  log: { 
    success, // Will prepend with a green checkmark
    warn, // Will prepend with a warning symbol
    error, // Will prepend with a red x
    active, // Will change the spinner to blue
    colors // Internal colors used by the logger
  },
  cache: { 
    save, // Cache data to .botswarm/cache.json under a given key
    load, // Load cached data for a given key
    clear // Clear all the cache for a key or entirely
  } 
} = BotSwarm({ ... });

const {
  ethereumClients, // Viem public clients for each chain
  ethereumWallets, // Viem wallet clients for each chain
  contracts: config.contracts, // User defined contracts
  tasks, // Tasks that are currently executing
  rescheduled, // Tasks that have been rescheduled
  addTask, // Add a task
  getTask, // Get a task with an id
  removeTask, // Remove a task
  rescheduleTask, // Reschedule a task for a later block
  cacheTasks, // Cache tasks to .botswarm/cache.json
  execute, // Internal function used to execute tasks
  executing, // Tasks that are currently executing
  write, // Write to a contract
  onBlock, // Watch a block on a given chain
  watch, // Watch a contract event
  read, // Read a contract
} = Ethereum({ ... });

const {
  farcasterClient, // The Farcaster client
  farcasterSigner, // The Farcaster signer
  cast, // Cast to Farcaster 
  removeCast, // Remove a cast
  reply, // Reply to a cast
  react, // React to a cast
  removeReaction, // Remove a reaction from a cast
  updateProfile, // Update your Farcaster profile
} = Farcaster({ ... })
```