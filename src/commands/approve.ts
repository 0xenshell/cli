import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getContract } from "../config.js";

export const approveCommand = new Command("approve")
  .description("Approve a queued action")
  .requiredOption("--action-id <id>", "Queued action ID")
  .action(async (opts) => {
    const spinner = ora("Approving action...").start();

    try {
      const contract = getContract();
      const tx = await contract.approveAction(BigInt(opts.actionId));

      spinner.text = "Waiting for confirmation...";
      const receipt = await tx.wait();

      spinner.succeed(chalk.green(`Action #${opts.actionId} approved`));
      console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${receipt.hash}`));
    } catch (err: any) {
      spinner.fail(chalk.red(`Approval failed: ${err.message}`));
      process.exit(1);
    }
  });
