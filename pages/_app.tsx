import React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeSettings } from "@/theme/Theme";
import createEmotionCache from "@/createEmotionCache";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IexecContextProvider } from "@/context/iExec";
import { privyConfig, wagmiConfig } from "@/components/config/wallet.config";

const clientSideEmotionCache = createEmotionCache();
const queryClient = new QueryClient();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  }: any = props;
  const theme = ThemeSettings();

  return (
    <PrivyProvider
      config={privyConfig}
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <CacheProvider value={emotionCache}>
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />
              <title>iExec Privy Example</title>
            </Head>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <IexecContextProvider>
                <Component {...pageProps} />
              </IexecContextProvider>
            </ThemeProvider>
          </CacheProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};

export default MyApp;
