import { createSpinner } from "nanospinner";
import figlet from "figlet";
import kleur from "kleur";

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
