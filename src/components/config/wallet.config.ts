import { http, createConfig } from "wagmi";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { PrivyClientConfig } from "@privy-io/react-auth";
import { polygon } from "viem/chains";
import { defineChain } from "viem";

// Define the iExec Sidechain
export const iexecSidechain = defineChain({
  id: 134,
  name: "iExec Sidechain",
  nativeCurrency: {
    decimals: 18,
    name: "xRLC",
    symbol: "xRLC",
  },
  rpcUrls: {
    default: {
      http: ["https://bellecour.iex.ec"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://blockscout-bellecour.iex.ec",
    },
  },
});

const metadata = {
  name: "iExec Privy Example",
  description: "iExec Privy Integration Example",
  url: "",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const connectors = [
  injected(),
  coinbaseWallet({
    appName: metadata.name,
    chainId: polygon.id,
  }),
  walletConnect({
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  }),
];

export const wagmiConfig = createConfig({
  chains: [polygon, iexecSidechain],
  transports: {
    [polygon.id]: http(
      "https://lb.nodies.app/v1/c4af832850924699b25128e185bde36e"
    ),
    [iexecSidechain.id]: http("https://bellecour.iex.ec"),
  },
  connectors,
  ssr: true,
});

export const privyConfig: PrivyClientConfig = {
  loginMethods: ["wallet", "email"],
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
  },
  defaultChain: polygon,
  supportedChains: [polygon, iexecSidechain],
};
