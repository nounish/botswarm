import colors from "kleur";
import figlet from "figlet";
import { description, version } from "../../package.json";
import { createSpinner } from "nanospinner";

export default function logger(defaultMessage: string) {
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

  let state = createSpinner(defaultMessage).start();

  return {
    info: (message: string) => {
      state.warn({
        text: message,
        mark: "🔹",
      });
      state = createSpinner(defaultMessage).start();
    },
    success: (message: string) => {
      state.success({
        text: message,
      });
      state = createSpinner(defaultMessage).start();
    },
    error: (message: string) => {
      state.error({
        text: message,
      });
      state = createSpinner(defaultMessage).start();
    },
    executing: (message: string) => {
      state.update({
        text: message,
        color: "blue",
      });
    },
  };
}
