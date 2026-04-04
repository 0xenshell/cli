import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { ENShell, Network } from "@enshell/sdk";
import { getSigner } from "../config.js";

export const reactivateCommand = new Command("reactivate")
  .description("Reactivate a frozen agent")
  .requiredOption("--id <agentId>", "Agent identifier")
  .action(async (opts) => {
    const spinner = ora("Reactivating agent...").start();

    try {
      const signer = await getSigner();
      const client = new ENShell({
        network: Network.SEPOLIA,
        signer,
      });

      const { txHash } = await client.reactivateAgent(opts.id);

      spinner.succeed(chalk.green(`Agent "${opts.id}" reactivated`));
      console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${txHash}`));
    } catch (err: any) {
      spinner.fail(chalk.red(`Reactivation failed: ${err.message}`));
      process.exit(1);
    }
  });
