import { describe, it, expect } from "vitest";
import { registerCommand } from "../src/commands/register.js";
import { listCommand } from "../src/commands/list.js";
import { inspectCommand } from "../src/commands/inspect.js";

import { freezeCommand } from "../src/commands/freeze.js";
import { activateCommand } from "../src/commands/activate.js";
import { protectCommand } from "../src/commands/protect.js";

describe("commands", () => {
  it("register command has correct name and required options", () => {
    expect(registerCommand.name()).toBe("register");
    const opts = registerCommand.options.map((o) => o.long);
    expect(opts).toContain("--id");
    expect(opts).toContain("--agent-wallet");
    expect(opts).toContain("--spend-limit");
  });

  it("list command has correct name", () => {
    expect(listCommand.name()).toBe("list");
  });

  it("inspect command has correct name and required options", () => {
    expect(inspectCommand.name()).toBe("inspect");
    const opts = inspectCommand.options.map((o) => o.long);
    expect(opts).toContain("--id");
  });

  it("freeze command has correct name and required options", () => {
    expect(freezeCommand.name()).toBe("freeze");
    const opts = freezeCommand.options.map((o) => o.long);
    expect(opts).toContain("--id");
  });

  it("activate command has correct name and required options", () => {
    expect(activateCommand.name()).toBe("activate");
    const opts = activateCommand.options.map((o) => o.long);
    expect(opts).toContain("--id");
  });

  it("protect command has correct name and required options", () => {
    expect(protectCommand.name()).toBe("protect");
    const opts = protectCommand.options.map((o) => o.long);
    expect(opts).toContain("--id");
    expect(opts).toContain("--target");
    expect(opts).toContain("--value");
    expect(opts).toContain("--instruction");
  });
});
