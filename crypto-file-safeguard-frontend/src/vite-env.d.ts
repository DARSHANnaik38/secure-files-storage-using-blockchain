/// <reference types="vite/client" />


/// <reference types="vite/client" />

// Add this interface to declare the ethereum object
interface Window {
  ethereum?: import('ethers').Eip1193Provider;
}