import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { ENShell, Network, ActionDecision } from "@enshell/sdk";
import { getSigner, getContractAddress } from "../config.js";

export const protectCommand = new Command("protect")
  .description("Submit an action through the ENShell firewall with encryption and relay")
  .requiredOption("--id <agentId>", "Agent identifier")
  .requiredOption("--target <address>", "Target contract address")
  .requiredOption("--value <eth>", "Value in ETH")
  .option("--data <hex>", "Calldata (hex)", "0x")
  .requiredOption("--instruction <text>", "Human-readable instruction")
  .action(async (opts) => {
    try {
      const signer = await getSigner();
      const client = new ENShell({
        network: Network.SEPOLIA,
        signer,
        contractAddress: getContractAddress(),
      });

      // Step 1: Encrypt + relay + submit
      const submitSpinner = ora("Encrypting instruction and submitting action...").start();
      const result = await client.protect(opts.id, {
        instruction: opts.instruction,
        tx: {
          to: opts.target,
          value: opts.value,
          data: opts.data,
        },
      });
      submitSpinner.succeed(
        chalk.green(`Action #${result.actionId} queued (hash: ${result.instructionHash.slice(0, 18)}...)`),
      );
      console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${result.txHash}`));

      // Step 2: Wait for CRE resolution
      const waitSpinner = ora("Waiting for CRE oracle resolution...").start();
      const decision = await result.waitForResolution();

      switch (decision) {
        case ActionDecision.APPROVED:
          waitSpinner.succeed(chalk.green("Action approved by CRE oracle"));
          break;
        case ActionDecision.ESCALATED:
          waitSpinner.warn(chalk.yellow("Action escalated - waiting for Ledger approval..."));
          break;
        case ActionDecision.BLOCKED:
          waitSpinner.fail(chalk.red("Action blocked by CRE oracle"));
          break;
        default:
          waitSpinner.info(`Decision: ${decision}`);
      }
    } catch (err: any) {
      console.error(chalk.red(`\nProtect failed: ${err.message}`));
      process.exit(1);
    }
  });
