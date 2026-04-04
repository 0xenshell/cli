import { describe, it, expect } from "vitest";
import { registerCommand } from "../src/commands/register.js";
import { listCommand } from "../src/commands/list.js";
import { inspectCommand } from "../src/commands/inspect.js";
import { submitCommand } from "../src/commands/submit.js";
import { approveCommand } from "../src/commands/approve.js";
import { rejectCommand } from "../src/commands/reject.js";
import { deactivateCommand } from "../src/commands/deactivate.js";
import { reactivateCommand } from "../src/commands/reactivate.js";
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

  it("submit command has correct name and required options", () => {
    expect(submitCommand.name()).toBe("submit");
    const opts = submitCommand.options.map((o) => o.long);
    expect(opts).toContain("--id");
    expect(opts).toContain("--target");
    expect(opts).toContain("--value");
    expect(opts).toContain("--instruction");
  });

  it("approve command has correct name and required options", () => {
    expect(approveCommand.name()).toBe("approve");
    const opts = approveCommand.options.map((o) => o.long);
    expect(opts).toContain("--action-id");
  });

  it("reject command has correct name and required options", () => {
    expect(rejectCommand.name()).toBe("reject");
    const opts = rejectCommand.options.map((o) => o.long);
    expect(opts).toContain("--action-id");
  });

  it("deactivate command has correct name and required options", () => {
    expect(deactivateCommand.name()).toBe("deactivate");
    const opts = deactivateCommand.options.map((o) => o.long);
    expect(opts).toContain("--id");
  });

  it("reactivate command has correct name and required options", () => {
    expect(reactivateCommand.name()).toBe("reactivate");
    const opts = reactivateCommand.options.map((o) => o.long);
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
