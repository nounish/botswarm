import { colors } from "../lib/logger.js";
import { Instance } from "../lib/ethereum/runner.js";

export default function parseInstanceIdentifier(Instance: Instance) {
  return `${colors.blue(Instance.name)}:${colors.magenta(
    Instance.id.substring(0, 5)
  )}`;
}
