#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .name("enshell")
  .description("CLI for ENShell on-chain AI agent firewall")
  .version("0.1.0");

program.parse();
