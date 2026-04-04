import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { ENShell, Network } from "@enshell/sdk";
import { getSigner, walletHint } from "../config.js";

export const freezeCommand = new Command("freeze")
  .description("Freeze an agent")
  .requiredOption("--id <agentId>", "Agent identifier")
  .action(async (opts) => {
    const spinner = ora(`Freezing agent${walletHint()}...`).start();

    try {
      const signer = await getSigner();
      const client = new ENShell({
        network: Network.SEPOLIA,
        signer,
      });

      const { txHash } = await client.deactivateAgent(opts.id);

      spinner.succeed(chalk.green(`Agent "${opts.id}" frozen`));
      console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${txHash}`));
    } catch (err: any) {
      spinner.fail(chalk.red(`Freeze failed: ${err.message}`));
      process.exit(1);
    }
  });
