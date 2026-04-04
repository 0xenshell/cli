import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { ENShell, Network } from "@enshell/sdk";
import { getSigner, walletHint } from "../config.js";

export const trustCommand = new Command("trust")
  .description("Check trust between two agents (writes TrustChecked event on-chain)")
  .requiredOption("--id <agentId>", "Your agent identifier (the checker)")
  .requiredOption("--check <targetId>", "Target agent to evaluate")
  .action(async (opts) => {
    const spinner = ora(`Checking trust: ${opts.id} → ${opts.check}${walletHint()}...`).start();

    try {
      const signer = await getSigner();
      const client = new ENShell({
        network: Network.SEPOLIA,
        signer,
      });

      const { trusted, txHash } = await client.checkTrust(opts.id, opts.check);

      if (trusted) {
        spinner.succeed(chalk.green(`${opts.check}.enshell.eth is TRUSTED`));
      } else {
        spinner.fail(chalk.red(`${opts.check}.enshell.eth is NOT TRUSTED`));
      }

      // Show details
      const agent = await client.getAgent(opts.check);
      const score = (Number(agent.threatScore) / 1000).toFixed(1);
      const scoreColor = Number(agent.threatScore) > 60000 ? chalk.red : Number(agent.threatScore) > 30000 ? chalk.yellow : chalk.green;

      console.log(chalk.gray(`  tx: https://sepolia.etherscan.io/tx/${txHash}`));
      console.log("");
      console.log(chalk.gray("  Agent:        ") + chalk.cyan(`${opts.check}.enshell.eth`));
      console.log(chalk.gray("  Threat Score: ") + scoreColor(`${score} / 100`));
      console.log(chalk.gray("  Strikes:      ") + chalk.white(`${agent.strikes}`));
      console.log(chalk.gray("  Active:       ") + (agent.active ? chalk.green("yes") : chalk.red("frozen")));
      console.log("");
    } catch (err: any) {
      spinner.fail(chalk.red(`Trust check failed: ${err.message}`));
      process.exit(1);
    }
  });
