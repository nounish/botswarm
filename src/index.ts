import BotSwarm from "./BotSwarm.js";

import type {
  Contract,
  Wallet,
  Client,
  Chain,
  FarcasterClient,
  FarcasterAccount,
} from "./utils/createConfig.js";
import type { Task } from "./lib/scheduler.js";
import type { Cast } from "@standard-crypto/farcaster-js";

import { success, error, active } from "./lib/logger.js";

export default BotSwarm;

export const log = { success, error, active };

export type {
  Contract,
  Wallet,
  Client,
  FarcasterClient,
  FarcasterAccount,
  Task,
  Chain,
  Cast,
};
