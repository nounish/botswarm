import { Logger, colors } from "../logger.js";
import hash from "../../utils/hash.js";
import parseInstanceIdentifier from "../../utils/parseInstanceIdentifier.js";
import { Cacher } from "../cacher.js";
import { EthereumChains } from "./index.js";

export type Instance = {
  id: string;
  name: string;
  block: number;
  chain: EthereumChains;
  args: any[];
};

export default function runner(
  runnerConfig: {
    scripts: Record<string, Function>;
    cacheInstances: boolean;
  },
  log: Logger,
  cacher: Cacher
) {
  let instances: Array<Instance> = [];
  let running: Record<string, boolean> = {};
  let rescheduled: Record<string, boolean> = {};

  if (runnerConfig.cacheInstances) {
    log.active("Loading cached script instances");

    const _instances: Array<Instance> | undefined = cacher.load("instances");

    if (_instances) instances = _instances;

    for (const instance of instances) {
      const identifier = parseInstanceIdentifier(instance);
      log.success(
        `Cached script instance ${identifier} rescheduled for block ${colors.yellow(
          instance.block
        )}`
      );
    }

    log.success("Finished syncing cached scripts");
  }

  async function schedule(config: {
    name: string;
    block: number;
    chain: EthereumChains;
    args: any[];
  }) {
    const instance: Instance = {
      id: hash(config),
      name: config.name,
      block: config.block,
      chain: config.chain,
      args: config.args,
    };

    const identifier = parseInstanceIdentifier(instance);

    log.active(`Adding script instance ${identifier}`);

    if (instances.find((_instance) => _instance.id === _instance.id)) {
      log.error(`Failed to add script instance ${identifier} already exists`);

      return false;
    }

    instances.push(instance);

    if (runnerConfig.cacheInstances) cacher.cache("instances", instances);

    log.success(
      `Sucessfully scheduled ${identifier} for block ${colors.yellow(
        instance.block
      )}`
    );
  }

  function reschedule(id: string, block: number, flagAsRescheduled?: boolean) {
    const index = instances.findIndex((instance) => instance.id === id);
    let instance = instances[index];

    const identifier = parseInstanceIdentifier(instance);

    if (index === -1) {
      log.error(`Failed to reschedule task ${identifier} does not exist`);

      return false;
    }

    instance.block = block;

    if (flagAsRescheduled) rescheduled[id] = true;

    if (runnerConfig.cacheInstances) cacher.cache("instances", instances);

    log.success(
      `Sucessfully rescheduled script instance ${identifier} for block ${colors.yellow(
        instance.block
      )}`
    );

    return true;
  }

  async function run(instance: Instance) {
    try {
      running[instance.id] = true;

      const identifier = parseInstanceIdentifier(instance);

      log.active(`Running script ${identifier}`);

      await runnerConfig.scripts[instance.name](...instance.args);

      log.success(`Script ${identifier} ran sucessfully`);

      return true;
    } catch (e) {
      running[instance.id] = false;

      log.error(e as string);

      return false;
    }
  }

  function getInstance(id: string) {
    const instance = instances.find((instance) => instance.id === id);

    if (!instance) {
      log.error(`Could not find script instance with id ${id}`);
    }

    return instance;
  }

  function cancel(id: string) {
    const index = instances.findIndex((instance) => instance.id === id);
    const instance = instances[index];

    const identifier = parseInstanceIdentifier(instance);

    if (index === -1) {
      log.error(
        `Failed to remove script instance ${identifier} does not exist`
      );

      return false;
    }

    instances.splice(index, 1);

    if (runnerConfig.cacheInstances) cacher.cache("instances", instances);

    log.success(`Sucessfully removed script instance ${identifier}`);

    return true;
  }

  return {
    run,
    running: () => running,
    schedule,
    instances: () => instances,
    getInstance,
    cancel,
    rescheduled: () => rescheduled,
    reschedule,
  };
}
