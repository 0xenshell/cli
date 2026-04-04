import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { ENShell, Network } from "@enshell/sdk";
import { getSigner, getContractAddress } from "../config.js";

export const approveCommand = new Command("approve")
  .description("Approve a queued action")
  .requiredOption("--action-id <id>", "Queued action ID")
  .action(async (opts) => {
    const spinner = ora("Approving action...").start();

    try {
      const client = new ENShell({
        network: Network.SEPOLIA,
        signer: getSigner(),
        contractAddress: getContractAddress(),
      });

      const { txHash } = await client.approveAction(BigInt(opts.actionId));

      spinner.succeed(chalk.green(`Action #${opts.actionId} approved`));
      console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${txHash}`));
    } catch (err: any) {
      spinner.fail(chalk.red(`Approval failed: ${err.message}`));
      process.exit(1);
    }
  });
