import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { ethers, Contract, BrowserProvider, Signer } from "ethers";

// --- CONTRACT DETAILS ---
// Update this every time you re-deploy the contract on Ganache
const contractAddress = "0xaE8F94d6Be092ae72fd1B46d61CbE22ef5a04013";
const contractABI = [
  {
    inputs: [
      { internalType: "string", name: "_fileHash", type: "string" },
      { internalType: "uint256", name: "_fileSize", type: "uint256" },
      { internalType: "string", name: "_fileName", type: "string" },
    ],
    name: "addFile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getFiles",
    outputs: [
      {
        components: [
          { internalType: "string", name: "fileHash", type: "string" },
          { internalType: "uint256", name: "fileSize", type: "uint256" },
          { internalType: "string", name: "fileName", type: "string" },
          { internalType: "uint256", name: "uploadTime", type: "uint256" },
          { internalType: "address", name: "uploader", type: "address" },
        ],
        internalType: "struct FileStorage.File[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
// --- END OF CONTRACT DETAILS ---

// Define the structure of a file as returned by the contract
export interface FileData {
  fileHash: string;
  fileSize: bigint;
  fileName: string;
  uploadTime: bigint;
  uploader: string;
}

// Define the shape of the data our context provides
interface IContractContext {
  contract: Contract | null;
  signer: Signer | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
  uploadFile: (hash: string, size: number, name: string) => Promise<void>;
  getMyFiles: () => Promise<FileData[]>;
}

// Create the context with a default value
const ContractContext = createContext<IContractContext>({
  contract: null,
  signer: null,
  connectWallet: async () => {},
  isConnected: false,
  uploadFile: async () => {},
  getMyFiles: async () => [],
});

// Create the Provider component
export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect MetaMask wallet
  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const userSigner = await provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          userSigner
        );

        setSigner(userSigner);
        setContract(contractInstance);
        setIsConnected(true);
        console.log("✅ Wallet connected successfully!");
      } catch (error) {
        console.error("❌ Failed to connect wallet:", error);
      }
    } else {
      console.error("❌ MetaMask is not installed.");
    }
  }, []);

  // Upload file to blockchain
  const uploadFile = useCallback(
    async (hash: string, size: number, name: string) => {
      if (!contract) {
        throw new Error("Contract is not connected.");
      }
      try {
        const tx = await contract.addFile(hash, size, name);
        console.log("📤 Transaction sent:", tx.hash);

        await tx.wait(); // wait for confirmation
        console.log("✅ File stored on blockchain!");
      } catch (error) {
        console.error("❌ Failed to upload file:", error);
      }
    },
    [contract]
  );

  // Fetch user’s files
  const getMyFiles = useCallback(async () => {
    if (!contract) {
      throw new Error("Contract is not connected.");
    }
    try {
      const files = await contract.getFiles();
      console.log("📂 Files fetched:", files);
      return files;
    } catch (error) {
      console.error("❌ Failed to fetch files:", error);
      return [];
    }
  }, [contract]);

  return (
    <ContractContext.Provider
      value={{
        contract,
        signer,
        connectWallet,
        isConnected,
        uploadFile,
        getMyFiles,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

// Custom hook to access the context
export const useContract = () => {
  return useContext(ContractContext);
};
