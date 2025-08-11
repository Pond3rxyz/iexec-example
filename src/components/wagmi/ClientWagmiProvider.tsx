import React, { useEffect, useMemo, useState } from "react";
import { WagmiProvider } from "@privy-io/wagmi";
import { http, createConfig } from "wagmi";
import { polygon } from "viem/chains";
import { iexecSidechain } from "@/components/config/wallet.config";

interface Props {
  children: React.ReactNode;
}

export default function ClientWagmiProvider({ children }: Props) {
  const [config, setConfig] = useState<any | null>(null);

  const transports = useMemo(
    () => ({
      [polygon.id]: http("https://lb.nodies.app/v1/c4af832850924699b25128e185bde36e"),
      [iexecSidechain.id]: http("https://bellecour.iex.ec"),
    }),
    []
  );

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      const { coinbaseWallet, injected, walletConnect } = await import(
        "wagmi/connectors"
      );

      const metadata = {
        name: "iExec Privy Example",
        description: "iExec Privy Integration Example",
        url: "",
        icons: ["https://avatars.githubusercontent.com/u/37784886"],
      };

      const connectors = [
        injected(),
        coinbaseWallet({ appName: metadata.name, chainId: polygon.id }),
        walletConnect({
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
        }),
      ];

      const cfg = createConfig({
        chains: [polygon, iexecSidechain],
        transports,
        connectors,
        ssr: true,
      } as any);

      if (isMounted) setConfig(cfg);
    }

    setup();
    return () => {
      isMounted = false;
    };
  }, [transports]);

  if (!config) return null;

  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}

