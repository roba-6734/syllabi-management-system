import React, { useState, useEffect } from "react";
import { useContract } from "../hooks/useContract";

const SyllabusList = () => {
  const [syllabi, setSyllabi] = useState([]);
  const syllabusManager = useContract();

  useEffect(() => {
    const fetchSyllabi = async () => {
      const count = await syllabusManager.syllabusCount();
      const syllabiList = [];
      for (let i = 1; i <= count; i++) {
        const syllabus = await syllabusManager.getSyllabus(i);
        syllabiList.push(syllabus);
      }
      setSyllabi(syllabiList);
    };
    if (syllabusManager) fetchSyllabi();
  }, [syllabusManager]);

  return (
    <div>
      <h2>Syllabus List</h2>
      <ul>
        {syllabi.map((syllabus, index) => (
          <li key={index}>
            CID: {syllabus[0]}, Institution: {syllabus[1]}, Votes: {syllabus[2]}
            , Approved: {syllabus[3] ? "Yes" : "No"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SyllabusList;
