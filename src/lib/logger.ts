import colors from "kleur";
import figlet from "figlet";
import { description, version } from "../../package.json";
import { createSpinner } from "nanospinner";

let state = createSpinner();

const defaultMessage = "Waiting for tasks...";

export function start() {
  console.log(
    figlet.textSync("BotSwarm", {
      font: "ANSI Shadow",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
  );

  console.log(colors.blue(description));
  console.log(`\nVersion: ${colors.magenta(version)}\n`);

  state.start({ text: "Waiting for tasks" });
}

export function info(message: string) {
  state.warn({
    text: message,
    mark: "🔹",
  });
  state = createSpinner(defaultMessage).start();
}

export function success(message: string) {
  state.success({
    text: message,
  });
  state = createSpinner(defaultMessage).start();
}

export function error(message: string) {
  state.error({
    text: message,
  });
  state = createSpinner(defaultMessage).start();
}

export function executing(message: string) {
  state.update({
    text: message,
    color: "blue",
  });
}

export function update(message: string) {
  state.update({
    text: message,
  });
}
