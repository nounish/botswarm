import createEthereum from "./lib/ethereum";
import type _ from "viem/node_modules/abitype";
import logger from "./lib/logger";
import createFarcaster from "./lib/farcaster";
import dotenv from "dotenv";
import cacher from "./lib/cacher";
dotenv.config();

export type BotSwarmConfig = { log: boolean };

export default function BotSwarm(config?: { log: BotSwarmConfig["log"] }) {
  const botswarmConfig = {
    log: true,
    ...config,
  } satisfies BotSwarmConfig;

  const { success, warn, error, active, colors } = logger(botswarmConfig);

  const { cache, load, clear } = cacher({ success, warn, error, active });

  const Ethereum = createEthereum(
    { ...botswarmConfig },
    { success, warn, error, active },
    { cache, load, clear }
  );

  const Farcaster = createFarcaster(
    { ...botswarmConfig },
    { success, warn, error, active }
  );

  return {
    Ethereum,
    Farcaster,
    log: { success, warn, error, active, colors },
  };
}
