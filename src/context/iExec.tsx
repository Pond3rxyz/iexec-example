// ** React Imports
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// ** Hooks & utils
import {
  GrantedAccess,
  GrantedAccessResponse,
  IExecDataProtector,
  ProtectedData,
  ProtectedDataWithSecretProps,
  RevokedAccess,
} from "@iexec/dataprotector";
import { useAccount, useSwitchChain } from "wagmi";
import { getEmbeddedConnectedWallet, useWallets } from "@privy-io/react-auth";
import { IEXEC_HF_ADDRESS } from "@/utils/custom";
import { iexecSidechain } from "@/components/config/wallet.config";

/**
 * Iexec interface
 */
interface IExec {
  dataProtector: IExecDataProtector | null;
  isInitializing: boolean;
  protectAndStoreData: (email: string) => Promise<{
    protectedData: ProtectedDataWithSecretProps;
    accessGranted: GrantedAccess;
  }>;
  fetchAccessGranted: () => Promise<{
    accessGranted: GrantedAccessResponse;
    protectedData: ProtectedData[];
  }>;
  revokeAllGrantedAccess: (
    protectedDataAddress: string
  ) => Promise<RevokedAccess[]>;
}

const iExecContext = createContext<IExec>({
  dataProtector: null,
  isInitializing: false,
  protectAndStoreData: async () => ({
    protectedData: {} as ProtectedDataWithSecretProps,
    accessGranted: {} as GrantedAccess,
  }),
  fetchAccessGranted: async () => ({
    accessGranted: {} as GrantedAccessResponse,
    protectedData: [],
  }),
  revokeAllGrantedAccess: async () => [] as RevokedAccess[],
});

/**
 * Iexec context provider
 */
export function IexecContextProvider({ children }: { children: ReactNode }) {
  const [dataProtector, setDataProtector] = useState<IExecDataProtector | null>(
    null
  );
  const [isInitializing, setIsInitializing] = useState(false);
  const { address, isConnected } = useAccount();
  const { wallets } = useWallets();
  const { switchChain } = useSwitchChain();
  const embeddedWallet = getEmbeddedConnectedWallet(wallets);

  useEffect(() => {
    if (isConnected && address && !isInitializing) {
      initSdk();
    }
  }, [isConnected, address]);

  const switchToIExecNetwork = async () => {
    try {
      await switchChain({ chainId: iexecSidechain.id });
      return true;
    } catch (error: any) {
      console.log("Error switching to iExec network:", error);
      return false;
    }
  };

  const initSdk = async () => {
    try {
      setIsInitializing(true);

      if (!isConnected || !address) return;

      if (!embeddedWallet) {
        console.log("No embedded wallet found for address:", address);
        return;
      }

      await switchToIExecNetwork();

      const provider = await embeddedWallet.getEthereumProvider();
      const initializedSdk = new IExecDataProtector(provider);
      setDataProtector(initializedSdk);
    } catch (error) {
      console.log("Error initializing iExec SDK:", error);
    } finally {
      setIsInitializing(false);
    }
  };

  const protectAndStoreData = async (email: string) => {
    try {
      if (!dataProtector) {
        throw new Error("DataProtector not initialized");
      }

      await switchToIExecNetwork();

      const saveEmail = await dataProtector.core.protectData({
        name: "my-email",
        data: {
          email: email,
        },
      });

      const accessGranted = await dataProtector.core.grantAccess({
        protectedData: saveEmail.address,
        authorizedApp: "web3mail.apps.iexec.eth",
        authorizedUser: IEXEC_HF_ADDRESS,
        numberOfAccess: 1000000,
        pricePerAccess: 0,
      });

      return {
        protectedData: saveEmail,
        accessGranted,
      };
    } catch (error) {
      console.log("Error saving the email:", error);
      throw error;
    }
  };

  const fetchAccessGranted = async () => {
    try {
      if (!dataProtector) {
        throw new Error("DataProtector not initialized");
      }

      const accessGranted = await dataProtector.core.getGrantedAccess({
        authorizedUser: IEXEC_HF_ADDRESS,
        isUserStrict: true,
      });

      const protectedData = await dataProtector.core.getProtectedData({
        owner: address,
      });

      return {
        accessGranted,
        protectedData,
      };
    } catch (error) {
      console.log("Error fetching access granted:", error);
      throw error;
    }
  };

  const revokeAllGrantedAccess = async (protectedDataAddress: string) => {
    try {
      if (!dataProtector) {
        throw new Error("DataProtector not initialized");
      }

      const revokeds = await dataProtector.core.revokeAllAccess({
        authorizedApp: "web3mail.apps.iexec.eth",
        authorizedUser: IEXEC_HF_ADDRESS,
        protectedData: protectedDataAddress,
      });
      console.log("Revoked:", revokeds);
      return revokeds;
    } catch (error) {
      console.log("Error revoking all access:", error);
      throw error;
    }
  };

  const value: IExec = {
    dataProtector,
    isInitializing,
    protectAndStoreData,
    fetchAccessGranted,
    revokeAllGrantedAccess,
  };

  return (
    <iExecContext.Provider value={value}>{children}</iExecContext.Provider>
  );
}

export function useIexec() {
  return useContext(iExecContext);
}
