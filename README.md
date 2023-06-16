```
██████╗  ██████╗ ████████╗███████╗██╗    ██╗ █████╗ ██████╗ ███╗   ███╗
██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝██║    ██║██╔══██╗██╔══██╗████╗ ████║
██████╔╝██║   ██║   ██║   ███████╗██║ █╗ ██║███████║██████╔╝██╔████╔██║
██╔══██╗██║   ██║   ██║   ╚════██║██║███╗██║██╔══██║██╔══██╗██║╚██╔╝██║
██████╔╝╚██████╔╝   ██║   ███████║╚███╔███╔╝██║  ██║██║  ██║██║ ╚═╝ ██║
╚═════╝  ╚═════╝    ╚═╝   ╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝

A typesafe cross chain MEV bot for scheduling and executing tasks at specific blocks or events.
```

# Getting Started

Running `npm run start` will start the bot which is defined in the `index.ts` file.

A simple instance of the bot looks like this

```typescript
import BotSwarm from "./src/BotSwarm";

const botswarm = BotSwarm();
```

# Configuration

BotSwarm pulls all of its configuration from the `botswarm.config.ts` file which holds information about each contract and Viem clients/wallets.

The wallet client is created for each chain using the private key stored in `.env`

```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
**Note:** This is not a real private key and is just used as an example

# Events

To run code on contract events, use the watch method and provide the contract and event name to track.

In this example, "New BidPlaced event!" is logged to the console every time the BidPlaced event is emitted on the NounsPool contract that is deployed on the Sepolia network

```typescript
import BotSwarm from "./src/BotSwarm";
import { contracts } from "./botswarm.config";

const { watch } = BotSwarm();

watch(contracts.sepolia.NounsPool, "BidPlaced", (event) => {
    console.log("New BidPlaced event!")
});
```

# Tasks

Tasks can be scheduled by providing a unique `id`, the `chain` to watch, the `block` number to execute the task on, and an `execute` function which must be async and return a boolean signifying if the execution was successful or not. BotSwarm will call the execute function on the task when the block number of the chain is greater than the block specified in the task. If the execute function returns true then the task will be removed from the queue. If it returns false then it will handle the error.

This example adds a task that executes 10 blocks after the block the BidPlaced event was fired on. By including the `propId` in the id of the task we can ensure that this task will only fire once per proposal as `addTask` will reject any task with an id that is already in the queue.

```typescript
import BotSwarm from "./src/BotSwarm";
import { contracts } from "./botswarm.config";
import { sepolia } from "viem/chains";

const { watch, addTask } = BotSwarm();

watch(contracts.sepolia.NounsPool, "BidPlaced", ({ blockNumber, args }) => {
    addTask({
        id: `castVote:${args.propId}`,
        chain: sepolia.network,
        block: blockNumber + 10n,
        execute: async () => {
            console.log("Executing task")
            return true
        },
     });
});
```

# Testing

Tests are broken up into 4 categories

## npm run test

This runs a mirrored version of `index.ts` but on the sepolia network. It includes code that automates creation of proposals in NounsDAO and submission of bids to the NounsPool.

## npm run test:lib

Unit tests everything in the `src/lib` directory which include all the components that make up a `src/BotSwarm` instance.

## npm run test:tasks

Unit tests custom prebuilt tasks in the `src/tasks` directory.

## npm run test:utils

Unit tests all the utilities in `src/utils`.
