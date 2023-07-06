import { colors } from "../lib/logger";

export default function parseTaskIdentifier(
  contract: string,
  functionName: string,
  id: string
) {
  return `${contract}:${colors.blue(functionName)}:${colors.magenta(
    id.substring(0, 5)
  )}`;
}
