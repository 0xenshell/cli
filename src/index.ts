#!/usr/bin/env node
import { Command } from "commander";
import { registerCommand } from "./commands/register.js";
import { listCommand } from "./commands/list.js";
import { inspectCommand } from "./commands/inspect.js";
import { submitCommand } from "./commands/submit.js";

const program = new Command();

program
  .name("enshell")
  .description("CLI for ENShell on-chain AI agent firewall")
  .version("0.1.0");

program.addCommand(registerCommand);
program.addCommand(listCommand);
program.addCommand(inspectCommand);
program.addCommand(submitCommand);

program.parse();
