# ENShell CLI

Command-line interface for **ENShell**, an on-chain firewall for AI agents. Register agents, submit actions through the firewall, approve or reject queued actions, and manage agent lifecycle. Built with Commander.js and the [@enshell/sdk](https://www.npmjs.com/package/@enshell/sdk).

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your RPC URL, private key, and contract address
```

## Configuration

The CLI reads from environment variables (via `.env`):

| Variable | Description |
|---|---|
| `ENSHELL_RPC_URL` | Ethereum RPC endpoint |
| `ENSHELL_PRIVATE_KEY` | Wallet private key (owner of the firewall contract) |
| `ENSHELL_CONTRACT_ADDRESS` | Deployed AgentFirewall contract address |

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Commands

### Agent Management

```bash
# Register a new agent (ENS subdomain trader.enshell.eth is computed automatically)
enshell register --id trader --agent-wallet 0x... --spend-limit 0.1 --targets 0x... 0x...

# List all registered agents
enshell list

# Inspect an agent
enshell inspect --id trader

# Deactivate (freeze) an agent
enshell deactivate --id trader

# Reactivate a frozen agent
enshell reactivate --id trader
```

### Action Firewall

```bash
# Submit an action through the firewall
enshell submit --id trader --target 0x... --value 0.05 --instruction "Send 0.05 ETH to treasury"

# Approve a queued action (Ledger approval)
enshell approve --action-id 0

# Reject a queued action
enshell reject --action-id 0
```

## License

MIT
