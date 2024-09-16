import React, { useState } from "react";
import { getUniversityRole } from "../services/contractService";

const UniversityRoleManager = () => {
  const [account, setAccount] = useState("");
  const [role, setRole] = useState("");

  const fetchRole = async () => {
    const role = await getUniversityRole(account);
    setRole(role);
  };

  return (
    <div className="container mt-5">
      <h2>University Role Manager</h2>
      <input
        type="text"
        className="form-control"
        placeholder="Enter account address"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
      />
      <button className="btn btn-primary mt-3" onClick={fetchRole}>
        Get Role
      </button>
      <p className="mt-3">Role: {role}</p>
    </div>
  );
};

export default UniversityRoleManager;
