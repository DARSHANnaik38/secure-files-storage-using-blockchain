import React, { createContext, useContext, useState, useCallback } from "react";
import { ethers, Contract, BrowserProvider, Signer } from "ethers";

// --- CONTRACT DETAILS ---
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Remember to update this!
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

// Define the shape of our context
interface IContractContext {
  contract: Contract | null;
  signer: Signer | null;
  connectWallet: () => Promise<void>; // The new function to connect
  isConnected: boolean; // A flag to check connection status
}

// Create the context
const ContractContext = createContext<IContractContext>({
  contract: null,
  signer: null,
  connectWallet: async () => {},
  isConnected: false,
});

// Create the Provider component
export const ContractProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // This function will now be called manually by the user
  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // This line will trigger the MetaMask pop-up
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
        console.log("Wallet connected successfully!");
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.error("MetaMask is not installed.");
    }
  }, []);

  return (
    <ContractContext.Provider
      value={{ contract, signer, connectWallet, isConnected }}
    >
      {children}
    </ContractContext.Provider>
  );
};

// Custom hook for easy access
export const useContract = () => {
  return useContext(ContractContext);
};
