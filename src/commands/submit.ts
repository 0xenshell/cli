import { Command } from "commander";
import { parseEther, keccak256, toUtf8Bytes } from "ethers";
import chalk from "chalk";
import ora from "ora";
import { getContract } from "../config.js";

export const submitCommand = new Command("submit")
  .description("Submit an action through the firewall (queued for CRE analysis)")
  .requiredOption("--id <agentId>", "Agent identifier")
  .requiredOption("--target <address>", "Target contract address")
  .requiredOption("--value <eth>", "Value in ETH")
  .option("--data <hex>", "Calldata (hex)", "0x")
  .requiredOption("--instruction <text>", "Human-readable instruction")
  .action(async (opts) => {
    const spinner = ora("Submitting action...").start();

    try {
      const contract = getContract();
      const instructionHash = keccak256(toUtf8Bytes(opts.instruction));

      const tx = await contract.submitAction(
        opts.id,
        opts.target,
        parseEther(opts.value),
        opts.data,
        instructionHash,
      );

      spinner.text = "Waiting for confirmation...";
      const receipt = await tx.wait();

      const iface = contract.interface;
      let actionId = "?";

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "ActionSubmitted") {
            actionId = parsed.args[0].toString();
            break;
          }
        } catch {
          // Skip logs from other contracts
        }
      }

      spinner.succeed(
        chalk.green(`Action #${actionId} queued for CRE analysis`),
      );
    } catch (err: any) {
      spinner.fail(chalk.red(`Submission failed: ${err.message}`));
      process.exit(1);
    }
  });
