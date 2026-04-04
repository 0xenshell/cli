import { Signer } from "ethers";
import { envGetSigner } from "./env.js";
import { wcGetSigner } from "./walletconnect.js";

export type WalletMode = "walletconnect" | "env" | "ledger";

/**
 * Resolve an ethers Signer based on the selected wallet mode.
 *
 * Default (no --wallet flag): WalletConnect (requires prior "enshell connect")
 * --wallet env: Private key from .env
 * --wallet ledger: Ledger USB (not yet implemented)
 */
export async function resolveSigner(mode: WalletMode): Promise<Signer> {
  switch (mode) {
    case "env":
      return envGetSigner();

    case "walletconnect":
      return wcGetSigner();

    case "ledger":
      throw new Error(
        "Ledger USB mode is not yet implemented. Use WalletConnect or --wallet env.",
      );

    default:
      throw new Error(`Unknown wallet mode: ${mode}`);
  }
}
