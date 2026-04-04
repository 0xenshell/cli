#!/usr/bin/env node
import { createRequire } from "node:module";
import { Command } from "commander";
import { setWalletMode } from "./config.js";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");
import type { WalletMode } from "./wallets/index.js";
import { registerCommand } from "./commands/register.js";
import { listCommand } from "./commands/list.js";
import { inspectCommand } from "./commands/inspect.js";
import { submitCommand } from "./commands/submit.js";

import { deactivateCommand } from "./commands/deactivate.js";
import { reactivateCommand } from "./commands/reactivate.js";
import { protectCommand } from "./commands/protect.js";
import { connectCommand } from "./commands/connect.js";
import { disconnectCommand } from "./commands/disconnect.js";

const program = new Command();

program
  .name("enshell")
  .description("CLI for ENShell on-chain AI agent firewall")
  .version(pkg.version)
  .option(
    "--wallet <mode>",
    "Wallet mode: env (private key) or ledger (USB)",
  )
  .hook("preAction", (thisCommand) => {
    const opts = thisCommand.opts();
    if (opts.wallet) {
      setWalletMode(opts.wallet as WalletMode);
    }
  });

program.addCommand(connectCommand);
program.addCommand(disconnectCommand);
program.addCommand(registerCommand);
program.addCommand(listCommand);
program.addCommand(inspectCommand);
program.addCommand(submitCommand);

program.addCommand(deactivateCommand);
program.addCommand(reactivateCommand);
program.addCommand(protectCommand);

program.parseAsync().then(() => process.exit(0));
