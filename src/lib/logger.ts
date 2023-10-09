import colors from "kleur";
import figlet from "figlet";
import details from "../../package.json" assert { type: "json" };
import { createSpinner } from "nanospinner";
import { BotSwarmConfig } from "../BotSwarm";

export { colors };

export type Logger = Omit<ReturnType<typeof logger>, "colors">;

export default function logger(botswarmConfig: BotSwarmConfig) {
  let state = createSpinner();

  const defaultMessage = "Waiting for tasks";

  if (botswarmConfig.log) {
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

  function success(message: string) {
    if (botswarmConfig.log) {
      state.success({
        text: message,
      });
      state = createSpinner(defaultMessage).start();
    }
  }

  function warn(message: string) {
    if (botswarmConfig.log) {
      state.warn({
        text: message,
      });
      state = createSpinner(defaultMessage).start();
    }
  }

  function error(message: string) {
    if (botswarmConfig.log) {
      state.error({
        text: message,
      });
      state = createSpinner(defaultMessage).start();
    }
  }

  function active(message: string) {
    if (botswarmConfig.log) {
      state.update({
        text: message,
        color: "blue",
      });
    }
  }

  return {
    success,
    warn,
    error,
    active,
    colors,
  };
}
