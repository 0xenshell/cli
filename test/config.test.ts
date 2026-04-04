import { describe, it, expect, vi, beforeEach } from "vitest";

describe("config", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("getProvider defaults to sepolia rpc when ENSHELL_RPC_URL is not set", async () => {
    vi.stubEnv("ENSHELL_RPC_URL", "");
    const { getProvider } = await import("../src/config.js");
    const provider = getProvider();
    // Should not throw — defaults to rpc.sepolia.org
    expect(provider).toBeDefined();
  });

  it("getContractAddress returns default when ENSHELL_CONTRACT_ADDRESS is not set", async () => {
    vi.stubEnv("ENSHELL_CONTRACT_ADDRESS", "");
    const { getContractAddress } = await import("../src/config.js");
    // Should return the default Sepolia contract address
    expect(getContractAddress()).toBe("0x93F0326C4F3a9a2e0209f5faAdFf375493027Cc9");
  });

  it("getContractAddress returns address when set", async () => {
    vi.stubEnv("ENSHELL_CONTRACT_ADDRESS", "0x1111111111111111111111111111111111111111");
    const { getContractAddress } = await import("../src/config.js");
    expect(getContractAddress()).toBe("0x1111111111111111111111111111111111111111");
  });
});
