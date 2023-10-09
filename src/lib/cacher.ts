import { join } from "path";
import { existsSync, writeFileSync, mkdirSync, readFileSync } from "fs";
import { stringify, parse } from "superjson";
import { Logger } from "./logger";

export type Cache<T = unknown> = {
  [key: string]: T;
};

export type Cacher = ReturnType<typeof cacher>;

export default function cacher(log: Logger) {
  const directory = join(process.cwd(), ".botswarm");

  const file = join(directory, "cache.json");

  function cache(key: string, data: unknown) {
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }

    writeFileSync(file, stringify({ [key]: data }));
  }

  function load<T = unknown>(key: string) {
    if (existsSync(file)) {
      try {
        const cache: Cache = parse(readFileSync(file, "utf-8"));

        return cache[key] as T;
      } catch {}
    }

    log.warn(`No cache was found for ${key}`);
  }

  function clear(key?: string) {
    if (key) {
      const cache: Cache = parse(readFileSync(file, "utf-8"));

      delete cache[key];

      writeFileSync(file, stringify(cache));
    }

    writeFileSync(file, stringify({}));
  }

  return {
    cache,
    load,
    clear,
  };
}
