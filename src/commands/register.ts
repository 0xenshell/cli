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
    try {
      const client = new ENShell({
        network: Network.SEPOLIA,
        signer: getSigner(),
        contractAddress: getContractAddress(),
      });

      // Step 1: Create ENS subdomain
      const ensSpinner = ora(`Creating ENS subdomain ${opts.id}.enshell.eth...`).start();
      const ensResult = await client.createAgentSubdomain(opts.id);
      ensSpinner.succeed(chalk.green(`ENS subdomain ${opts.id}.enshell.eth created`));
      if (ensResult.txHash) {
        console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${ensResult.txHash}`));
      }

      // Step 2: Register on firewall
      const fwSpinner = ora("Registering agent on ENShell Firewall...").start();
      const fwResult = await client.registerAgentOnChain(opts.id, {
        agentAddress: opts.agentWallet,
        spendLimit: opts.spendLimit,
        allowedTargets: opts.targets,
      });
      fwSpinner.succeed(chalk.green(`Agent "${opts.id}" registered on firewall`));
      console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${fwResult.txHash}`));
    } catch (err: any) {
      console.error(chalk.red(`\nRegistration failed: ${err.message}`));
      process.exit(1);
    }
  });
