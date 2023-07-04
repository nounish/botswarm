import colors from "kleur";
import figlet from "figlet";
import details from "../../package.json" assert { type: "json" };
import { createSpinner } from "nanospinner";

let state = createSpinner();

const defaultMessage = "Waiting for tasks";

export { colors };

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

  console.log(colors.blue(details.description));
  console.log(`\nVersion: ${colors.magenta(details.version)}\n`);

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
