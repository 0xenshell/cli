import { describe, it, expect, vi, beforeEach } from "vitest";
import { NETWORK_CONFIG, Network } from "@enshell/sdk";

describe("config", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("getProvider defaults to sepolia rpc when ENSHELL_RPC_URL is not set", async () => {
    vi.stubEnv("ENSHELL_RPC_URL", "");
    const { getProvider } = await import("../src/config.js");
    const provider = getProvider();
    expect(provider).toBeDefined();
  });

  it("getContractAddress returns SDK default when ENSHELL_CONTRACT_ADDRESS is not set", async () => {
    vi.stubEnv("ENSHELL_CONTRACT_ADDRESS", "");
    const { getContractAddress } = await import("../src/config.js");
    expect(getContractAddress()).toBe(NETWORK_CONFIG[Network.SEPOLIA].firewallAddress);
  });

  it("getContractAddress returns address when set", async () => {
    vi.stubEnv("ENSHELL_CONTRACT_ADDRESS", "0x1111111111111111111111111111111111111111");
    const { getContractAddress } = await import("../src/config.js");
    expect(getContractAddress()).toBe("0x1111111111111111111111111111111111111111");
  });
});
