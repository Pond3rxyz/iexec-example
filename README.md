# iExec Privy Integration Example

A simplified Next.js application demonstrating Privy wallet integration with iExec data protection functionality.

## Features

- **Privy Wallet Integration**: Connect wallets using Privy's embedded wallet solution
- **iExec Data Protection**: Protect and manage sensitive data using iExec's DataProtector
- **Network Switching**: Automatic switching to iExec Sidechain for data protection operations
- **Clean UI**: Simple Material-UI interface for wallet connection and data protection

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Create .env.local file
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

3. Run the development server:
```bash
npm run dev
```

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect using Privy's embedded wallet
2. **Switch Network**: The app will automatically prompt you to switch to iExec Sidechain
3. **Protect Data**: Enter an email address and click "Protect Data" to encrypt it
4. **Fetch Access**: Click "Fetch Access" to view your protected data and access grants

## Key Components

- `pages/index.tsx`: Main application with wallet connection and iExec functionality
- `src/context/iExec.tsx`: iExec DataProtector context for data protection operations
- `src/components/config/wallet.config.ts`: Privy and Wagmi configuration
- `pages/_app.tsx`: App wrapper with all necessary providers

## Dependencies

- `@privy-io/react-auth`: Privy wallet integration
- `@privy-io/wagmi`: Wagmi integration for Privy
- `@iexec/dataprotector`: iExec data protection SDK
- `@mui/material`: UI components
- `viem` & `wagmi`: Ethereum interaction
- `@tanstack/react-query`: Data fetching

## Network Requirements

The application requires users to be on the iExec Sidechain (chainId: 0x86) for data protection operations. The app will automatically prompt users to switch networks when needed. # iexec-example
