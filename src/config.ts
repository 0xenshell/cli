import "dotenv/config";
import { Wallet, JsonRpcProvider } from "ethers";
import { getFirewallContract } from "@enshell/sdk";

export function getProvider(): JsonRpcProvider {
  const rpcUrl = process.env.ENSHELL_RPC_URL;
  if (!rpcUrl) throw new Error("ENSHELL_RPC_URL not set in environment");
  return new JsonRpcProvider(rpcUrl);
}

export function getSigner(): Wallet {
  const pk = process.env.ENSHELL_PRIVATE_KEY;
  if (!pk) throw new Error("ENSHELL_PRIVATE_KEY not set in environment");
  return new Wallet(pk, getProvider());
}

export function getContractAddress(): string {
  const addr = process.env.ENSHELL_CONTRACT_ADDRESS;
  if (!addr) throw new Error("ENSHELL_CONTRACT_ADDRESS not set in environment");
  return addr;
}

export function getContract() {
  return getFirewallContract(getContractAddress(), getSigner());
}
