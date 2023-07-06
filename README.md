```
██████╗  ██████╗ ████████╗███████╗██╗    ██╗ █████╗ ██████╗ ███╗   ███╗
██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝██║    ██║██╔══██╗██╔══██╗████╗ ████║
██████╔╝██║   ██║   ██║   ███████╗██║ █╗ ██║███████║██████╔╝██╔████╔██║
██╔══██╗██║   ██║   ██║   ╚════██║██║███╗██║██╔══██║██╔══██╗██║╚██╔╝██║
██████╔╝╚██████╔╝   ██║   ███████║╚███╔███╔╝██║  ██║██║  ██║██║ ╚═╝ ██║
╚═════╝  ╚═════╝    ╚═╝   ╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
```

# Getting Started

BotSwarm is a typesafe cross chain framework for scheduling and executing transactions at specific blocks or events.

To get started you can either clone [our implementation of BotSwarm](https://github.com/nounish/federation-bot) or follow along with the steps below.

## Installation

Create a new NPM project and run

```bash
npm i @nounish/botswarm
```

## Configuration

Once BotSwarm is installed you can initialize an instance by providing it with the configuration of your contracts. When passing in the ABI you must declare it as const or it won't be typesafe. BotSwarm uses [Viem](https://viem.sh/) under the hood and the deployment networks are extended from it.

```typescript
import BotSwarm from "@nounish/botswarm";

const bot = BotSwarm({
  NounsPool: { // The contract name
    abi: [...] as const, // The contract abi
    deployments: {
      mainnet: "0xA...A" // The network and address of the deployment 
    }
  }
})
```

Before BotSwarm can be run it needs a private key which is automatically loaded from `.env`.

```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
**Note:** This is not a real private key and is just used as an example

# Usage

All of BotSwarms features can be accessed by the return value of your instance. See [Advanced Customization](#advanced-customization) for more advanced usage.

## Reacting to onchain events

To react to onchain events you can use `onBlock` or `watch`. 

The `onBlock` function takes in a chain and a callback which will be called on every new block.

The `watch` function takes in the contract name, chain, event name, and a callback. These values are typesafe and are derived from the configuration passed into `BotSwarm()`. Once a BidPlaced event is picked up BotSwarm will run the callback. The event object returned by the `watch` callback is a Viem [Log](https://viem.sh/docs/glossary/types.html#log).

```typescript 
import BotSwarm from "@nounish/botswarm";
import NounsPoolABI from "./contracts/NounsPool.js";

const { onBlock, watch } = BotSwarm({
  NounsPool: {
    abi: NounsPoolABI, 
    deployments: {
      mainnet: "0xBE5E6De0d0Ac82b087bAaA1d53F145a52EfE1642"
    }
  }
});

onBlock("mainnet", async (block) => {
  console.log(`Current block: ${block}`);
})

watch({
  contract: "NounsPool",
  chain: "mainnet",
  event: "BidPlaced",
}, async (event) => {
  console.log("A new bid was placed!");
})
```

## Read and writing to contracts

BotSwarm also returns a `read` and `write` function for abitrary contract calls. These are typesafe wrappers around Viem's `readContract` and `writeContract` functions.

```typescript 
import BotSwarm from "@nounish/botswarm";
import NounsPoolABI from "./contracts/NounsPool.js";

const { read, write } = BotSwarm({
  NounsPool: {
    abi: NounsPoolABI, 
    deployments: {
      mainnet: "0xBE5E6De0d0Ac82b087bAaA1d53F145a52EfE1642"
    }
  }
});

const { castWindow } = await read({
  contract: "NounsPool",
  chain: "mainnet",
  functionName: "getConfig",
});

const hash = await write({
  contract: "NounsPool",
  chain: "mainnet",
  functionName: "castVote",
  args: [325]
});
```

## Scheduling tasks

Tasks are specified contract calls to be executed after a given block. To add a task call `addTask` which takes in a block number and an `execute` object which mimics the parameters of the `write` function used above. BotSwarm will watch the specified chain and call the `write` function when the current block is >= the block passed into `addTask`. Below is an example of [our implementation](https://github.com/nounish/federation-bot) of this to cast a NounsPool vote result to NounsDAO before the proposal ends. 

If task execution fails then BotSwarm will make a second attempt and reschedule it a few blocks after. If the execution fails a second time then the task will be removed from the queue.

All tasks are cached to `.botswarm/cache.txt` when added or removed. BotSwarm will load all cached tasks when restarted.

```typescript
import BotSwarm from "@nounish/botswarm";
import NounsPoolABI from "./contracts/NounsPool.js";
import NounsDAOLogicV2ABI from "./contracts/NounsDAOLogicV2.js";

const { addTask, watch, read } = BotSwarm({
  NounsPool: {
    abi: NounsPoolABI,
    deployments: {
      mainnet: "0xBE5E6De0d0Ac82b087bAaA1d53F145a52EfE1642",
    },
  },
  NounsDAOLogicV2: {
    abi: NounsDAOLogicV2ABI,
    deployments: {
      mainnet: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d",
    },
  },
});

watch(
  { contract: "NounsPool", chain: "mainnet", event: "BidPlaced" },
  async (event) => {
    if (!event.args.propId) return;

    const { castWindow } = await read({
      contract: "NounsPool",
      chain: "mainnet",
      functionName: "getConfig",
    });

    const { endBlock } = await read({
      contract: "NounsDAOLogicV2",
      chain: "mainnet",
      functionName: "proposals",
      args: [event.args.propId],
    });

    addTask({
      block: endBlock - castWindow,
      execute: {
        contract: "NounsPool",
        chain: "mainnet",
        functionName: "castVote",
        args: [event.args.propId],
      },
    });
  }
);
```

# Advanced Customization

For the most part the only functions you will need to run BotSwarm will be `addTask`, `read`, and `watch`. However, when your situation requires more control over how tasks are added or contracts are written to, BotSwarm returns all of the functions and variables it uses internally. Below is a complete example of all of the components you can use to add advanced functionality to your bot.

```typescript
import BotSwarm from "@nounish/botswarm";
import NounsPoolABI from "./contracts/NounsPool.js";
import NounsDAOLogicV2ABI from "./contracts/NounsDAOLogicV2.js";

const {
    clients, // Viem public clients for each chain
    wallets, // Viem wallet clients for each chain
    contracts, // A readonly representation of the contracts passed into BotSwarm()
    
    tasks, // The current active tasks 
    rescheduled, // Tasks that have been rescheduled
    addTask,
    removeTask, // Remove a task
    rescheduleTask, // Reschedule a task
    cacheTasks, // Cache tasks to .botswarm/cache.txt

    execute, // Internal function used to execute tasks
    executing, // Tasks that are currently executing
    write,

    onBlock,
    watch,
    read,
  } = BotSwarm({
  NounsPool: {
    abi: NounsPoolABI,
    deployments: {
      mainnet: "0xBE5E6De0d0Ac82b087bAaA1d53F145a52EfE1642",
    },
  },
  NounsDAOLogicV2: {
    abi: NounsDAOLogicV2ABI,
    deployments: {
      mainnet: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d",
    },
  },
});
```

## Task Id

Internally, BotSwarm manages tasks by providing each task an id. The generation of this id is determined by hashing the contents of the task together to ensure no task is added twice.

## Usage with Viem

BotSwarm uses Viem under the hood but it can be used directly by referencing the contracts object.

```typescript
import BotSwarm from "@nounish/botswarm";
import NounsPoolABI from "./contracts/NounsPool.js";
import NounsDAOLogicV2ABI from "./contracts/NounsDAOLogicV2.js";
import { getContract } from "viem";

const { contracts, clients, wallets } = BotSwarm({
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