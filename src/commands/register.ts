import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { ENShell, Network } from "@enshell/sdk";
import { getSigner, getContractAddress } from "../config.js";

export const registerCommand = new Command("register")
  .description("Register a new AI agent on the firewall")
  .requiredOption("--id <agentId>", "Unique agent identifier (becomes <id>.enshell.eth)")
  .requiredOption("--agent-wallet <address>", "Agent's wallet address")
  .requiredOption("--spend-limit <limit>", "Spend limit in ETH")
  .option("--targets <addresses...>", "Allowed target addresses")
  .action(async (opts) => {
    const spinner = ora("Creating ENS subdomain and registering agent...").start();

    try {
      const client = new ENShell({
        network: Network.SEPOLIA,
        signer: getSigner(),
        contractAddress: getContractAddress(),
      });

      await client.registerAgent(opts.id, {
        agentAddress: opts.agentWallet,
        spendLimit: opts.spendLimit,
        allowedTargets: opts.targets,
      });

      spinner.succeed(
        chalk.green(`Agent "${opts.id}" registered as ${opts.id}.enshell.eth`),
      );
    } catch (err: any) {
      spinner.fail(chalk.red(`Registration failed: ${err.message}`));
      process.exit(1);
    }
  });
