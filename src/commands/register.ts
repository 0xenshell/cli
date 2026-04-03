import { Command } from "commander";
import { parseEther } from "ethers";
import chalk from "chalk";
import ora from "ora";
import { getContract } from "../config.js";

export const registerCommand = new Command("register")
  .description("Register a new AI agent on the firewall")
  .requiredOption("--id <agentId>", "Unique agent identifier")
  .requiredOption("--address <address>", "Agent wallet address")
  .requiredOption("--ens-node <ensNode>", "ENS node (bytes32 hash)")
  .requiredOption("--spend-limit <limit>", "Spend limit in ETH")
  .option("--targets <addresses...>", "Allowed target addresses")
  .action(async (opts) => {
    const spinner = ora("Registering agent...").start();

    try {
      const contract = getContract();

      const tx = await contract.registerAgentSimple(
        opts.id,
        opts.ensNode,
        opts.address,
        parseEther(opts.spendLimit),
      );

      spinner.text = "Waiting for confirmation...";
      const receipt = await tx.wait();

      spinner.succeed(
        chalk.green(`Agent "${opts.id}" registered (tx: ${receipt.hash})`),
      );

      if (opts.targets && opts.targets.length > 0) {
        const targetSpinner = ora("Setting allowed targets...").start();
        const targetTx = await contract.setAllowedTargets(
          opts.id,
          opts.targets,
          true,
        );
        await targetTx.wait();
        targetSpinner.succeed(
          chalk.green(`Set ${opts.targets.length} allowed target(s)`),
        );
      }
    } catch (err: any) {
      spinner.fail(chalk.red(`Registration failed: ${err.message}`));
      process.exit(1);
    }
  });
