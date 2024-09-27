import React, { useState } from "react";
import { useContract } from "../hooks/useContract";

const VoteOnSyllabus = () => {
  const [syllabusId, setSyllabusId] = useState("");
  const [status, setStatus] = useState("");
  const syllabusManager = useContract();

  const voteOnSyllabus = async () => {
    if (!syllabusId || !syllabusManager) return;

    setStatus("Voting...");
    const tx = await syllabusManager.voteOnSyllabus(syllabusId);
    await tx.wait();
    setStatus("Vote submitted successfully");
  };

  return (
    <div>
      <h2>Vote on Syllabus</h2>
      <input
        type="text"
        value={syllabusId}
        placeholder="Syllabus ID"
        onChange={(e) => setSyllabusId(e.target.value)}
      />
      <button onClick={voteOnSyllabus}>Vote</button>
      <p>{status}</p>
    </div>
  );
};

export default VoteOnSyllabus;
