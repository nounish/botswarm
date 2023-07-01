import BotSwarm from "./src/BotSwarm";
import type { Contract, Chain, Wallet, Client } from "./src/utils/createConfig";
import type { Task } from "./src/lib/scheduler";

export default BotSwarm;

export type { Contract, Chain, Wallet, Client, Task };
