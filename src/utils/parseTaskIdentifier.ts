import { colors } from "../lib/logger.js";
import { Task } from "../lib/ethereum/scheduler.js";

export default function parseTaskIdentifier(task: Task) {
  return `${colors.green(task.execute.contract)}:${colors.blue(
    task.execute.functionName
  )}:${colors.magenta(task.id.substring(0, 5))}`;
}
