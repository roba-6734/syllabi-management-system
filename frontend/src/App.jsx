import React from "react";
import Header from "./components/Header";
import SubmitSyllabus from "./components/SubmitSyllabus";
import VoteOnSyllabus from "./components/VoteOnSyllabus";
import SyllabusList from "./components/SyllabusList";

const App = () => {
  return (
    <div>
      <Header />
      <SubmitSyllabus />
      <SyllabusList />
      <VoteOnSyllabus />
    </div>
  );
};

export default App;
