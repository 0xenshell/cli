import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getContract } from "../config.js";

export const rejectCommand = new Command("reject")
  .description("Reject a queued action")
  .requiredOption("--action-id <id>", "Queued action ID")
  .action(async (opts) => {
    const spinner = ora("Rejecting action...").start();

    try {
      const contract = getContract();
      const tx = await contract.rejectAction(BigInt(opts.actionId));

      spinner.text = "Waiting for confirmation...";
      const receipt = await tx.wait();

      spinner.succeed(chalk.green(`Action #${opts.actionId} rejected`));
      console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${receipt.hash}`));
    } catch (err: any) {
      spinner.fail(chalk.red(`Rejection failed: ${err.message}`));
      process.exit(1);
    }
  });
