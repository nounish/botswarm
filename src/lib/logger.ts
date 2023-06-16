import { createSpinner } from "nanospinner";
import figlet from "figlet";
import kleur from "kleur";
import { description, version } from "../../package.json";

export default function logger(
  defaultMessage: string,
  options?: { testing?: boolean }
) {
  // We don't want to log anything during unit tests
  if (options?.testing) {
    return {
      info: (message: string) => {},
      success: (message: string) => {},
      error: (message: string) => {},
      executing: (message: string) => {},
      colors: kleur,
    };
  }

  console.log(
    figlet.textSync("BotSwarm", {
      font: "ANSI Shadow",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
  );

  console.log(kleur.blue(description));
  console.log(`\nVersion: ${kleur.magenta(version)}\n`);

  let state = createSpinner(defaultMessage).start();

  function info(message: string) {
    state.warn({
      text: message,
      mark: "🔹",
    });
    state = createSpinner(defaultMessage).start();
  }

  function success(message: string) {
    state.success({
      text: message,
    });
    state = createSpinner(defaultMessage).start();
  }

  function error(message: string) {
    state.error({
      text: message,
    });
    state = createSpinner(defaultMessage).start();
  }

  function executing(message: string) {
    state.update({
      text: message,
      color: "blue",
    });
  }

  return {
    info,
    success,
    error,
    executing,
    colors: kleur,
  };
}
