import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAddress, contractABI } from "../utils/config";

export const useContract = () => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadContract = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          await provider.send("eth_requestAccounts", []); // Request account access
          const signer = provider.getSigner();
          const syllabusManager = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setContract(syllabusManager);
        } catch (error) {
          console.error("Error loading contract: ", error);
        }
      } else {
        console.error("MetaMask is not installed");
      }
    };

    loadContract();
  }, []);

  return contract;
};
