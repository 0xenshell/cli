#!/usr/bin/env node
import { Command } from "commander";
import { registerCommand } from "./commands/register.js";

const program = new Command();

program
  .name("enshell")
  .description("CLI for ENShell on-chain AI agent firewall")
  .version("0.1.0");

program.addCommand(registerCommand);

program.parse();
