import { Command } from "commander";
import chalk from "chalk";
import { wcDisconnect } from "../wallets/walletconnect.js";

export const disconnectCommand = new Command("disconnect")
  .description("Disconnect wallet and clear saved session")
  .action(async () => {
    try {
      await wcDisconnect();
      console.log(chalk.green("  Wallet disconnected. Session cleared."));
    } catch (err: any) {
      console.log(chalk.yellow(`  ${err.message}`));
      // Clear session file anyway
      const { FileStorage } = await import("../wallets/storage.js");
      FileStorage.clear();
      console.log(chalk.green("  Session file cleared."));
    }
  });
