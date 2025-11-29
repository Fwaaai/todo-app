import chalk from "chalk";

export const logResponse = (status: number, message: string, reqid: number) => {
    if (status >= 200 && status < 300) {
      console.log(
        chalk.green(
          `[${new Date().toISOString()}][ReqID=${reqid}] ${status}: ${message}`
        )
      );
    } else if (status >= 400 && status < 500) {
      console.log(
        chalk.red(
          `[${new Date().toISOString()}][ReqID=${reqid}] ${status}: ${message}`
        )
      );
    } else if (status >= 500) {
      console.log(
        chalk.bgRed.white(
          `[${new Date().toISOString()}][ReqID=${reqid}] ${status}: ${message}`
        )
      );
    } else {
      console.log(
        `[${new Date().toISOString()}][ReqID=${reqid}] ${status}: ${message}`
      );
    }
  };
