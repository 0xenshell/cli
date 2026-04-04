import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { ENShell, Network } from "@enshell/sdk";
import { getSigner, getContractAddress } from "../config.js";

export const deactivateCommand = new Command("deactivate")
  .description("Deactivate (freeze) an agent")
  .requiredOption("--id <agentId>", "Agent identifier")
  .action(async (opts) => {
    const spinner = ora("Deactivating agent...").start();

    try {
      const signer = await getSigner();
      const client = new ENShell({
        network: Network.SEPOLIA,
        signer,
        contractAddress: getContractAddress(),
      });

      const { txHash } = await client.deactivateAgent(opts.id);

      spinner.succeed(chalk.green(`Agent "${opts.id}" deactivated`));
      console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${txHash}`));
    } catch (err: any) {
      spinner.fail(chalk.red(`Deactivation failed: ${err.message}`));
      process.exit(1);
    }
  });
