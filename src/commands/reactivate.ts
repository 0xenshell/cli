import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getContract } from "../config.js";

export const reactivateCommand = new Command("reactivate")
  .description("Reactivate a frozen agent")
  .requiredOption("--id <agentId>", "Agent identifier")
  .action(async (opts) => {
    const spinner = ora("Reactivating agent...").start();

    try {
      const contract = getContract();
      const tx = await contract.reactivateAgent(opts.id);

      spinner.text = "Waiting for confirmation...";
      await tx.wait();

      spinner.succeed(chalk.green(`Agent "${opts.id}" reactivated`));
    } catch (err: any) {
      spinner.fail(chalk.red(`Reactivation failed: ${err.message}`));
      process.exit(1);
    }
  });
