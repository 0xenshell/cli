import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getContract } from "../config.js";

export const listCommand = new Command("list")
  .description("List all registered agent IDs")
  .action(async () => {
    const spinner = ora("Fetching agents...").start();

    try {
      const contract = getContract();
      const count = await contract.getAgentCount();

      if (count === 0n) {
        spinner.info("No agents registered.");
        return;
      }

      const ids: string[] = [];
      for (let i = 0n; i < count; i++) {
        ids.push(await contract.agentIds(i));
      }

      spinner.stop();
      console.log(chalk.bold(`\nRegistered agents (${count}):\n`));
      for (const id of ids) {
        console.log(`  - ${id}`);
      }
      console.log();
    } catch (err: any) {
      spinner.fail(chalk.red(`Failed to list agents: ${err.message}`));
      process.exit(1);
    }
  });
