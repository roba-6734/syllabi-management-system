import React, { useState } from "react";
import Web3 from "web3";
import { uploadFile } from "./ipfs"; // Ensure that the named export `uploadFile` exists in your ipfs.js file
import { Buffer } from "buffer"; // Import Buffer to handle file conversions

function App() {
  const [accounts, setAccounts] = useState([]);
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState("");

  // Function to retrieve blockchain accounts
  const getAccounts = async () => {
    try {
      const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
      console.log(accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // Function to handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to upload the file to IPFS
  const handleUpload = async () => {
    if (!file) return; // Ensure file is selected

    const reader = new FileReader();
    reader.readAsArrayBuffer(file); // Read file as an array buffer

    reader.onloadend = async () => {
      try {
        const buffer = Buffer.from(reader.result); // Convert file content to Buffer
        const ipfsCid = await uploadFile(buffer); // Upload file to IPFS
        setCid(ipfsCid); // Set the IPFS CID
        console.log("File CID:", ipfsCid);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  };

  return (
    <div>
      <h2>Upload Syllabus to IPFS and Retrieve Accounts</h2>

      {/* Button to get blockchain accounts */}
      <button onClick={getAccounts}>Get Accounts</button>

      {/* Display blockchain accounts */}
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>{account}</li>
        ))}
      </ul>

      <hr />

      {/* File input and upload button */}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload to IPFS</button>

      {/* Display the CID after upload */}
      {cid && (
        <div>
          <h4>Uploaded File CID: {cid}</h4>
        </div>
      )}
    </div>
  );
}

export default App;
