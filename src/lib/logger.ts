import colors from "kleur";
import { textSync } from "figlet";
import { description, version } from "../../package.json";
import { createSpinner } from "nanospinner";

let state = createSpinner();

const defaultMessage = "Waiting for tasks";

export { colors };

export function start() {
  console.log(
    textSync("BotSwarm", {
      font: "ANSI Shadow",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
  );

  console.log(colors.blue(description));
  console.log(`\nVersion: ${colors.magenta(version)}\n`);

  state.start({ text: defaultMessage });
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

export function active(message: string) {
  state.update({
    text: message,
    color: "blue",
  });
}
