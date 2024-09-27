import React, { useState } from "react";
import { ethers } from "ethers";

const Header = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setAccount(await signer.getAddress());
    } else {
      alert("MetaMask not found");
    }
  };

  return (
    <header>
      <h1>Sepolia Syllabus Manager</h1>
      <button onClick={connectWallet}>
        {account
          ? `Connected: ${account.substring(0, 6)}...`
          : "Connect Wallet"}
      </button>
    </header>
  );
};

export default Header;
