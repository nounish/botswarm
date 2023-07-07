import BotSwarm from "./BotSwarm.js";
import type { Contract, Wallet, Client, Chain } from "./utils/createConfig.js";
import type { Task } from "./lib/scheduler.js";
import { success, error, active } from "./lib/logger.js";

export default BotSwarm;

export const log = { success, error, active };

export type { Contract, Wallet, Client, Task, Chain };
