// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SyllabusManager is AccessControl {
    // Define roles
    bytes32 public constant MINISTRY_ROLE = keccak256("MINISTRY_ROLE");  // Ministry of Education role
    bytes32 public constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");  // University role

    uint public approvalThreshold = 3;  // Number of votes needed to approve a syllabus

    struct Syllabus {
        uint id;
        string cid; // IPFS CID
        address institution;
        uint voteCount;
        bool approved;
        mapping(address => bool) votes;
    }

    uint public syllabusCount = 0;
    mapping(uint => Syllabus) public syllabi;

    // Events
    event SyllabusSubmitted(uint syllabusId, string cid, address institution);
    event SyllabusVoted(uint syllabusId, address voter);
    event SyllabusApproved(uint syllabusId);
    event NodeRegistered(address newNode);

    constructor() {
        // Grant the deployer the Ministry of Education role (MINISTRY_ROLE)
        _setupRole(MINISTRY_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);  // Admin role is also held by the Ministry
    }

    // Ministry of Education registers new nodes (universities)
    function registerNode(address _newNode) public onlyRole(MINISTRY_ROLE) {
        grantRole(UNIVERSITY_ROLE, _newNode);
        emit NodeRegistered(_newNode);
    }

    // University submits a new syllabus
    function submitSyllabus(string memory _cid) public onlyRole(UNIVERSITY_ROLE) {
        syllabusCount++;
        Syllabus storage newSyllabus = syllabi[syllabusCount];
        newSyllabus.id = syllabusCount;
        newSyllabus.cid = _cid;
        newSyllabus.institution = msg.sender;
        newSyllabus.voteCount = 0;
        newSyllabus.approved = false;
        emit SyllabusSubmitted(syllabusCount, _cid, msg.sender);
    }

    // Any node can vote on a syllabus, but each node can only vote once per syllabus
    function voteOnSyllabus(uint _syllabusId) public {
    // Check if the sender has either the MINISTRY_ROLE or UNIVERSITY_ROLE
    require(
        hasRole(MINISTRY_ROLE, msg.sender) || hasRole(UNIVERSITY_ROLE, msg.sender),
        "You do not have permission to vote"
    );

    Syllabus storage syllabus = syllabi[_syllabusId];
    require(!syllabus.votes[msg.sender], "Already voted on this syllabus");
    require(!syllabus.approved, "Syllabus already approved");

    // Register the vote
    syllabus.votes[msg.sender] = true;
    syllabus.voteCount++;

    emit SyllabusVoted(_syllabusId, msg.sender);

    // Check if the vote count exceeds the threshold
    if (syllabus.voteCount >= approvalThreshold) {
        syllabus.approved = true;
        emit SyllabusApproved(_syllabusId);
    }
}

    // Ministry of Education (Admin) can update the vote threshold
    function updateApprovalThreshold(uint _newThreshold) public onlyRole(MINISTRY_ROLE) {
        approvalThreshold = _newThreshold;
    }

    // View the status of a syllabus
    function getSyllabus(uint _syllabusId) public view returns (string memory, address, uint, bool) {
        Syllabus storage syllabus = syllabi[_syllabusId];
        return (syllabus.cid, syllabus.institution, syllabus.voteCount, syllabus.approved);
    }
}
