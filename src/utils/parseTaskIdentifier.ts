import { colors } from "../lib/logger.js";
import { Task } from "../lib/scheduler.js";

export default function parseTaskIdentifier(task: Task) {
  return `${colors.green(task.contract)}:${colors.blue(
    task.functionName
  )}:${colors.magenta(task.id.substring(0, 5))}`;
}
