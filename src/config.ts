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
  const rpcUrl = process.env.ENSHELL_RPC_URL || "https://rpc.sepolia.org";
  return new JsonRpcProvider(rpcUrl);
}

export async function getSigner(): Promise<Signer> {
  return resolveSigner(_walletMode);
}

export function getContractAddress(): string {
  const addr = process.env.ENSHELL_CONTRACT_ADDRESS;
  if (!addr)
    return "0xeb91387Ea4B7ADF8fA4901B22B2B72d7c54cbF13"; // Sepolia default
  return addr;
}

/** Read-only contract instance (no signer needed). */
export function getContract() {
  return getFirewallContract(getContractAddress(), getProvider());
}
