import { Command } from "commander";
import { parseEther } from "ethers";
import chalk from "chalk";
import ora from "ora";
import { getContract } from "../config.js";

export const submitCommand = new Command("submit")
  .description("Submit an action through the firewall")
  .requiredOption("--id <agentId>", "Agent identifier")
  .requiredOption("--target <address>", "Target contract address")
  .requiredOption("--value <eth>", "Value in ETH")
  .option("--data <hex>", "Calldata (hex)", "0x")
  .requiredOption("--instruction <text>", "Human-readable instruction")
  .action(async (opts) => {
    const spinner = ora("Submitting action...").start();

    try {
      const contract = getContract();

      const tx = await contract.submitAction(
        opts.id,
        opts.target,
        parseEther(opts.value),
        opts.data,
        opts.instruction,
      );

      spinner.text = "Waiting for confirmation...";
      const receipt = await tx.wait();

      const iface = contract.interface;
      let result = "Unknown";

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "ActionApproved") {
            result = chalk.green("Approved");
            break;
          }
          if (parsed?.name === "ActionEscalated") {
            result = chalk.yellow(`Escalated (action #${parsed.args[0]}, threat score: ${parsed.args[2]})`);
            break;
          }
          if (parsed?.name === "ActionBlocked") {
            result = chalk.red(`Blocked: ${parsed.args[2]}`);
            break;
          }
        } catch {
          // Skip logs from other contracts
        }
      }

      spinner.succeed(`Action result: ${result}`);
    } catch (err: any) {
      spinner.fail(chalk.red(`Submission failed: ${err.message}`));
      process.exit(1);
    }
  });
