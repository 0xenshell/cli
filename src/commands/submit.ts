import { Command } from "commander";
import { keccak256, toUtf8Bytes } from "ethers";
import chalk from "chalk";
import ora from "ora";
import { ENShell, Network } from "@enshell/sdk";
import { getSigner, walletHint } from "../config.js";

export const submitCommand = new Command("submit")
  .description("Submit an action through the firewall (queued for CRE analysis)")
  .requiredOption("--id <agentId>", "Agent identifier")
  .requiredOption("--target <address>", "Target contract address")
  .requiredOption("--value <eth>", "Value in ETH")
  .option("--data <hex>", "Calldata (hex)", "0x")
  .requiredOption("--instruction <text>", "Human-readable instruction")
  .action(async (opts) => {
    const spinner = ora(`Submitting action${walletHint()}...`).start();

    try {
      const signer = await getSigner();
      const client = new ENShell({
        network: Network.SEPOLIA,
        signer,
      });

      const instructionHash = keccak256(toUtf8Bytes(opts.instruction));

      const result = await client.submitAction(
        opts.id,
        opts.target,
        opts.value,
        opts.data,
        instructionHash,
      );

      spinner.succeed(
        chalk.green(`Action #${result.actionId} queued for CRE analysis`),
      );
      console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${result.txHash}`));
    } catch (err: any) {
      spinner.fail(chalk.red(`Submission failed: ${err.message}`));
      process.exit(1);
    }
  });
