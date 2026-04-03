import { describe, it, expect, vi, beforeEach } from "vitest";

describe("config", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("getProvider throws when ENSHELL_RPC_URL is not set", async () => {
    vi.stubEnv("ENSHELL_RPC_URL", "");
    const { getProvider } = await import("../src/config.js");
    expect(() => getProvider()).toThrow("ENSHELL_RPC_URL not set");
  });

  it("getSigner throws when ENSHELL_PRIVATE_KEY is not set", async () => {
    vi.stubEnv("ENSHELL_RPC_URL", "https://rpc.sepolia.org");
    vi.stubEnv("ENSHELL_PRIVATE_KEY", "");
    const { getSigner } = await import("../src/config.js");
    expect(() => getSigner()).toThrow("ENSHELL_PRIVATE_KEY not set");
  });

  it("getContractAddress throws when ENSHELL_CONTRACT_ADDRESS is not set", async () => {
    vi.stubEnv("ENSHELL_CONTRACT_ADDRESS", "");
    const { getContractAddress } = await import("../src/config.js");
    expect(() => getContractAddress()).toThrow("ENSHELL_CONTRACT_ADDRESS not set");
  });

  it("getContractAddress returns address when set", async () => {
    vi.stubEnv("ENSHELL_CONTRACT_ADDRESS", "0x1111111111111111111111111111111111111111");
    const { getContractAddress } = await import("../src/config.js");
    expect(getContractAddress()).toBe("0x1111111111111111111111111111111111111111");
  });
});
