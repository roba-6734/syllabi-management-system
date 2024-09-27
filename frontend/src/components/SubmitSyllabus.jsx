import React, { useState } from "react";
import { uploadToIPFS } from "../utils/ipfs";
import { useContract } from "../hooks/useContract";

const SubmitSyllabus = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const syllabusManager = useContract();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const submitSyllabus = async () => {
    if (!file || !syllabusManager) return;

    setStatus("Uploading to IPFS...");
    const cid = await uploadToIPFS(file);
    setStatus(`IPFS CID: ${cid}`);

    setStatus("Submitting to contract...");
    const tx = await syllabusManager.submitSyllabus(cid);
    await tx.wait();
    setStatus("Syllabus submitted successfully");
  };

  return (
    <div>
      <h2>Submit Syllabus</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={submitSyllabus}>Submit</button>
      <p>{status}</p>
    </div>
  );
};

export default SubmitSyllabus;
