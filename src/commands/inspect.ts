import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { formatEther } from "ethers";
import { getContract } from "../config.js";

export const inspectCommand = new Command("inspect")
  .description("Inspect a registered agent")
  .requiredOption("--id <agentId>", "Agent identifier")
  .action(async (opts) => {
    const spinner = ora("Fetching agent...").start();

    try {
      const contract = getContract();
      const agent = await contract.getAgent(opts.id);

      spinner.stop();

      const statusColor = agent.active ? chalk.green("Active") : chalk.red("Frozen");

      console.log(chalk.bold(`\nAgent: ${opts.id}\n`));
      console.log(`  Status:          ${statusColor}`);
      console.log(`  Address:         ${agent.agentAddress}`);
      console.log(`  ENS Node:        ${agent.ensNode}`);
      console.log(`  Spend Limit:     ${formatEther(agent.spendLimit)} ETH`);
      console.log(`  Threat Score:    ${agent.threatScore}`);
      console.log(`  Strikes:         ${agent.strikes}`);
      console.log(`  World ID:        ${agent.worldIdVerified ? "Verified" : "Not verified"}`);
      console.log(`  Registered At:   ${new Date(Number(agent.registeredAt) * 1000).toISOString()}`);
      console.log();
    } catch (err: any) {
      spinner.fail(chalk.red(`Failed to inspect agent: ${err.message}`));
      process.exit(1);
    }
  });
