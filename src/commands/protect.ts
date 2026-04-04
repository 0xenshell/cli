import { createInterface } from "node:readline";
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { ENShell, Network, ActionDecision } from "@enshell/sdk";
import type { ResolutionResult } from "@enshell/sdk";
import { getSigner, walletHint } from "../config.js";

function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

function displayAnalysis(result: ResolutionResult, actionId: bigint): void {
  const a = result.analysis;
  const score = a ? (a.score / 1000).toFixed(1) : "?";
  const label =
    result.decision === ActionDecision.ESCALATED ? "ESCALATED" : "BLOCKED";
  const color =
    result.decision === ActionDecision.ESCALATED ? chalk.yellow : chalk.red;

  console.log("");
  console.log(color(`  ${result.decision === ActionDecision.ESCALATED ? "\u26a0" : "\u2718"}  Action #${actionId} ${label} by CRE oracle`));
  console.log("");
  console.log(chalk.gray(`     Score:       `) + color(`${score} / 100`));
  if (a?.agentId) console.log(chalk.gray(`     Agent:       `) + chalk.cyan(`${a.agentId}.enshell.eth`));
  if (a?.target) console.log(chalk.gray(`     Target:      `) + chalk.white(a.target));
  if (a?.instruction) console.log(chalk.gray(`     Instruction: `) + chalk.green(`"${a.instruction}"`));
  console.log("");

  if (a?.reasoning) {
    console.log(chalk.gray("     Analysis:"));
    console.log(chalk.gray("     " + "\u2500".repeat(50)));
    const lines = a.reasoning.replace(/\. /g, ".\n     ").split("\n");
    for (const line of lines) {
      console.log(chalk.white(`     ${line}`));
    }
    console.log(chalk.gray("     " + "\u2500".repeat(50)));
  }
  console.log("");
}

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
      });

      // Step 1: Encrypt + relay + submit
      const submitSpinner = ora(`Encrypting and submitting action${walletHint()}...`).start();
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
      const resolution = await result.waitForResolution();

      switch (resolution.decision) {
        case ActionDecision.APPROVED:
          waitSpinner.succeed(chalk.green("Action approved by CRE oracle"));
          break;

        case ActionDecision.ESCALATED: {
          waitSpinner.warn(chalk.yellow("Action escalated — human approval required"));
          displayAnalysis(resolution, result.actionId);

          const answer = await prompt(chalk.yellow("  ? Approve this action? (y/n) "));

          if (answer === "y" || answer === "yes") {
            const approveSpinner = ora(`Approving action #${result.actionId}${walletHint()}...`).start();
            const { txHash } = await client.approveAction(result.actionId);
            approveSpinner.succeed(chalk.green(`Action #${result.actionId} approved`));
            console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${txHash}`));
          } else {
            const rejectSpinner = ora(`Rejecting action #${result.actionId}${walletHint()}...`).start();
            const { txHash } = await client.rejectAction(result.actionId);
            rejectSpinner.succeed(chalk.red(`Action #${result.actionId} rejected`));
            console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${txHash}`));
          }
          break;
        }

        case ActionDecision.BLOCKED:
          waitSpinner.fail(chalk.red("Action blocked by CRE oracle"));
          displayAnalysis(resolution, result.actionId);
          break;

        default:
          waitSpinner.info(`Decision: ${resolution.decision}`);
      }
    } catch (err: any) {
      console.error(chalk.red(`\nProtect failed: ${err.message}`));
      process.exit(1);
    }
  });
