import "dotenv/config";
import { JsonRpcProvider, Signer } from "ethers";
import { getFirewallContract, Network, NETWORK_CONFIG } from "@enshell/sdk";
import { resolveSigner, WalletMode } from "./wallets/index.js";

/** Global wallet mode — set by --wallet flag in index.ts */
let _walletMode: WalletMode = "walletconnect";
let _keyName: string | undefined;

export function setWalletMode(mode: WalletMode): void {
  _walletMode = mode;
}

export function getWalletMode(): WalletMode {
  return _walletMode;
}

export function setKeyName(name: string | undefined): void {
  _keyName = name;
}

export function getKeyName(): string | undefined {
  return _keyName;
}

/** Returns a hint string for commands when wallet approval is needed. */
export function walletHint(): string {
  return _walletMode === "walletconnect" ? " — approve in your wallet" : "";
}

export function getProvider(): JsonRpcProvider {
  const rpcUrl = process.env.ENSHELL_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
  return new JsonRpcProvider(rpcUrl);
}

export async function getSigner(): Promise<Signer> {
  return resolveSigner(_walletMode, _keyName);
}

export function getContractAddress(): string {
  return process.env.ENSHELL_CONTRACT_ADDRESS || NETWORK_CONFIG[Network.SEPOLIA].firewallAddress;
}

/** Read-only contract instance (no signer needed). */
export function getContract() {
  return getFirewallContract(getContractAddress(), getProvider());
}
