import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import qrcode from "qrcode-terminal";
import chalk from "chalk";
import { FileStorage } from "./storage.js";

const PROJECT_ID = "7c42ddbb278eb49df82a8340fae31e95";
const SEPOLIA_CHAIN_ID = 11155111;

async function initProvider(): Promise<InstanceType<typeof EthereumProvider>> {
  const storage = new FileStorage();

  const provider = await EthereumProvider.init({
    projectId: PROJECT_ID,
    metadata: {
      name: "ENShell CLI",
      description: "On-chain firewall for AI agents",
      url: "https://enshell.xyz",
      icons: ["https://enshell.xyz/assets/images/enshell-icon.png"],
    },
    showQrModal: false,
    optionalChains: [SEPOLIA_CHAIN_ID],
    optionalMethods: [
      "eth_sendTransaction",
      "personal_sign",
      "eth_signTypedData_v4",
      "eth_accounts",
      "eth_requestAccounts",
      "eth_call",
      "eth_getBalance",
      "eth_signTransaction",
    ],
    optionalEvents: ["chainChanged", "accountsChanged"],
    storage,
    rpcMap: {
      [SEPOLIA_CHAIN_ID]:
        process.env.ENSHELL_RPC_URL || "https://rpc.sepolia.org",
    },
  });

  return provider;
}

/**
 * Start a new WalletConnect session. Shows QR code in terminal.
 * Saves session to ~/.enshell/wc-session.json for reuse.
 * Returns the connected address.
 */
export async function wcConnect(): Promise<string> {
  const provider = await initProvider();

  // Check if there's already an active session
  if (provider.session) {
    const address = provider.accounts[0];
    if (address) {
      return address;
    }
  }

  // No existing session — show QR code
  return new Promise<string>((resolve, reject) => {
    provider.on("display_uri", (uri: string) => {
      console.log(
        chalk.cyan(
          "\n  Scan this QR code with your wallet (MetaMask, Rainbow, etc.)\n",
        ),
      );
      qrcode.generate(uri, { small: true });
      console.log(chalk.gray("\n  Or paste this URI in your wallet:"));
      console.log(chalk.gray(`  ${uri}\n`));
      console.log(chalk.gray("  Waiting for approval..."));
    });

    provider
      .connect()
      .then(() => {
        const address = provider.accounts[0];
        resolve(address);
      })
      .catch(reject);
  });
}

/**
 * Resume an existing WalletConnect session.
 * Returns an ethers JsonRpcSigner if a valid session exists.
 * Throws if no session is found.
 */
export async function wcGetSigner(): Promise<JsonRpcSigner> {
  const provider = await initProvider();

  if (!provider.session || !provider.accounts[0]) {
    throw new Error(
      'No wallet connected. Run "enshell connect" first.\n' +
        "  Alternatively, use --wallet env (.env private key).",
    );
  }

  const ethersProvider = new BrowserProvider(provider);
  return ethersProvider.getSigner();
}

/**
 * Disconnect the WalletConnect session and clear stored session.
 */
export async function wcDisconnect(): Promise<void> {
  const provider = await initProvider();

  if (provider.session) {
    await provider.disconnect();
  }

  FileStorage.clear();
}
