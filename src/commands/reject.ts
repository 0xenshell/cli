import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { ENShell, Network } from "@enshell/sdk";
import { getSigner, walletHint } from "../config.js";

export const rejectCommand = new Command("reject")
  .description("Reject a queued action")
  .requiredOption("--action-id <id>", "Queued action ID")
  .action(async (opts) => {
    const spinner = ora(`Rejecting action${walletHint()}...`).start();

    try {
      const signer = await getSigner();
      const client = new ENShell({
        network: Network.SEPOLIA,
        signer,
      });

      const { txHash } = await client.rejectAction(BigInt(opts.actionId));

      spinner.succeed(chalk.green(`Action #${opts.actionId} rejected`));
      console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${txHash}`));
    } catch (err: any) {
      spinner.fail(chalk.red(`Rejection failed: ${err.message}`));
      process.exit(1);
    }
  });
