import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { wcConnect } from "../wallets/walletconnect.js";

export const connectCommand = new Command("connect")
  .description("Connect your wallet via WalletConnect")
  .action(async () => {
    const spinner = ora("Initializing WalletConnect...").start();

    try {
      spinner.stop();
      const address = await wcConnect();
      console.log(chalk.green(`\n  Connected: ${address}`));
      console.log(
        chalk.gray("  Session saved. You can now run any enshell command.\n"),
      );
      process.exit(0);
    } catch (err: any) {
      spinner.fail(chalk.red(`Connection failed: ${err.message}`));
      process.exit(1);
    }
  });
