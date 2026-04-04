import "dotenv/config";
import { Wallet, JsonRpcProvider } from "ethers";

/**
 * Create an ethers Wallet signer from environment variables.
 * Requires ENSHELL_PRIVATE_KEY and ENSHELL_RPC_URL in .env.
 */
export function envGetSigner(): Wallet {
  const rpcUrl = process.env.ENSHELL_RPC_URL;
  if (!rpcUrl) throw new Error("ENSHELL_RPC_URL not set in environment");

  const pk = process.env.ENSHELL_PRIVATE_KEY;
  if (!pk) throw new Error("ENSHELL_PRIVATE_KEY not set in environment");

  const provider = new JsonRpcProvider(rpcUrl);
  return new Wallet(pk, provider);
}
