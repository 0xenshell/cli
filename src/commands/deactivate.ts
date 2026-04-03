import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getContract } from "../config.js";

export const deactivateCommand = new Command("deactivate")
  .description("Deactivate (freeze) an agent")
  .requiredOption("--id <agentId>", "Agent identifier")
  .action(async (opts) => {
    const spinner = ora("Deactivating agent...").start();

    try {
      const contract = getContract();
      const tx = await contract.deactivateAgent(opts.id);

      spinner.text = "Waiting for confirmation...";
      await tx.wait();

      spinner.succeed(chalk.green(`Agent "${opts.id}" deactivated`));
    } catch (err: any) {
      spinner.fail(chalk.red(`Deactivation failed: ${err.message}`));
      process.exit(1);
    }
  });
