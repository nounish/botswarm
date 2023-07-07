import { colors } from "../lib/logger.js";

export default function parseTaskIdentifier(
  contract: string,
  functionName: string,
  id: string
) {
  return `${colors.green(contract)}:${colors.blue(
    functionName
  )}:${colors.magenta(id.substring(0, 5))}`;
}
