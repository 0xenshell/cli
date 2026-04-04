import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { getContract, getSigner } from "../config.js";

export const listCommand = new Command("list")
  .description("List your registered agents")
  .option("--all", "List all agents on the network (not just yours)")
  .action(async (opts) => {
    const spinner = ora("Fetching agents...").start();

    try {
      const contract = getContract();
      const count = await contract.getAgentCount();

      if (count === 0n) {
        spinner.info("No agents registered on the network.");
        return;
      }

      // Get connected wallet address for filtering
      let myAddress: string | null = null;
      if (!opts.all) {
        try {
          const signer = await getSigner();
          myAddress = (await signer.getAddress()).toLowerCase();
        } catch {
          // If no wallet connected, show all with a hint
          spinner.warn("No wallet connected. Showing all agents. Use --all to suppress this warning.");
          myAddress = null;
        }
      }

      const agents: { id: string; active: boolean; score: bigint }[] = [];
      for (let i = 0n; i < count; i++) {
        const id = await contract.agentIds(i);
        const agent = await contract.getAgent(id);
        if (myAddress && agent.owner.toLowerCase() !== myAddress) continue;
        agents.push({ id, active: agent.active, score: agent.threatScore });
      }

      spinner.stop();

      if (agents.length === 0) {
        console.log(chalk.gray("\n  No agents found for your wallet.\n"));
        return;
      }

      const label = myAddress ? "Your agents" : "All agents";
      console.log(chalk.bold(`\n${label} (${agents.length}):\n`));
      for (const a of agents) {
        const status = a.active ? chalk.green("ACTIVE") : chalk.red("FROZEN");
        const score = chalk.gray(`score: ${(Number(a.score) / 1000).toFixed(1)}`);
        console.log(`  ${chalk.cyan(a.id + ".enshell.eth")}  ${status}  ${score}`);
      }
      console.log();
    } catch (err: any) {
      spinner.fail(chalk.red(`Failed to list agents: ${err.message}`));
      process.exit(1);
    }
  });
