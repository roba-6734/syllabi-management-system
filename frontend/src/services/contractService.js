import Web3 from "web3";
import SyllabusManagerABI from "../contracts/SyllabusManager.json";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const contractAddress = "0x20e2029d513498fd3051D630a0B136a7EDded59C";
const SyllabusManagerContract = new web3.eth.Contract(
  SyllabusManagerABI.abi,
  contractAddress
);

export const getUniversityRole = async (account) => {
  return await SyllabusManagerContract.methods
    .UNIVERSITY_ROLE()
    .call({ from: account });
};

export const validateSyllabus = async (syllabusData, account) => {
  return await SyllabusManagerContract.methods
    .validateSyllabus(syllabusData)
    .send({ from: account });
};
