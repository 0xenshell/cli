import "dotenv/config";
import { Wallet, JsonRpcProvider } from "ethers";

/**
 * Create an ethers Wallet signer from environment variables.
 * With --key <name>, reads ENSHELL_PRIVATE_KEY_<NAME> instead of ENSHELL_PRIVATE_KEY.
 */
export function envGetSigner(keyName?: string): Wallet {
  const rpcUrl = process.env.ENSHELL_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";

  const suffix = keyName ? `_${keyName.toUpperCase()}` : "";
  const envVar = `ENSHELL_PRIVATE_KEY${suffix}`;
  const pk = process.env[envVar];
  if (!pk) throw new Error(`${envVar} not set in environment`);

  const provider = new JsonRpcProvider(rpcUrl);
  return new Wallet(pk, provider);
}
