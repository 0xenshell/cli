import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { ENShell, Network } from "@enshell/sdk";
import { getSigner } from "../config.js";

export const registerCommand = new Command("register")
  .description("Register a new AI agent on the firewall")
  .requiredOption("--id <agentId>", "Unique agent identifier (becomes <id>.enshell.eth)")
  .requiredOption("--agent-wallet <address>", "Agent's wallet address")
  .requiredOption("--spend-limit <limit>", "Spend limit in ETH")
  .option("--targets <addresses...>", "Allowed target addresses")
  .action(async (opts) => {
    try {
      const signer = await getSigner();
      const client = new ENShell({
        network: Network.SEPOLIA,
        signer,
      });

      const spinner = ora(`Registering agent "${opts.id}" (creates ${opts.id}.enshell.eth)...`).start();
      const result = await client.registerAgent(opts.id, {
        agentAddress: opts.agentWallet,
        spendLimit: opts.spendLimit,
        allowedTargets: opts.targets,
      });
      spinner.succeed(chalk.green(`Agent "${opts.id}" registered as ${opts.id}.enshell.eth`));
      console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${result.txHash}`));
    } catch (err: any) {
      console.error(chalk.red(`\nRegistration failed: ${err.message}`));
      process.exit(1);
    }
  });
