import "dotenv/config";
import { JsonRpcProvider, Signer } from "ethers";
import { getFirewallContract } from "@enshell/sdk";
import { resolveSigner, WalletMode } from "./wallets/index.js";

/** Global wallet mode — set by --wallet flag in index.ts */
let _walletMode: WalletMode = "walletconnect";

export function setWalletMode(mode: WalletMode): void {
  _walletMode = mode;
}

export function getWalletMode(): WalletMode {
  return _walletMode;
}

export function getProvider(): JsonRpcProvider {
  const rpcUrl = process.env.ENSHELL_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
  return new JsonRpcProvider(rpcUrl);
}

export async function getSigner(): Promise<Signer> {
  return resolveSigner(_walletMode);
}

export function getContractAddress(): string {
  const addr = process.env.ENSHELL_CONTRACT_ADDRESS;
  if (!addr)
    return "0x93F0326C4F3A9a2e0209f5faAdFf375493027Cc9"; // Sepolia default
  return addr;
}

/** Read-only contract instance (no signer needed). */
export function getContract() {
  return getFirewallContract(getContractAddress(), getProvider());
}
