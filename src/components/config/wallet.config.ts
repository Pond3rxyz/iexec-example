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

export const privyConfig: PrivyClientConfig = {
  loginMethods: ["google"],
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
  },
  defaultChain: polygon,
  supportedChains: [polygon, iexecSidechain],
};
