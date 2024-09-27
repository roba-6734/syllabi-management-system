// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SyllabusManager is AccessControl {
    // Define roles
    bytes32 public constant MINISTRY_ROLE = keccak256("MINISTRY_ROLE");  // Ministry of Education role
    bytes32 public constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");  // University role

    // Number of votes needed to approve a syllabus
    uint public approvalThreshold = 2;  // Set default approval threshold (can be updated)

    // Store registered nodes
    address[] public registeredNodes;

    // Tracks when a syllabus was last approved for each institution
    mapping(address => uint) public lastApprovedTime;

    // Structure for Syllabus
    struct Syllabus {
        uint id;
        string cid;  // IPFS CID
        address institution;
        uint voteCount;
        bool approved;
        bool ministryVotedInFavor;  // Track if the ministry voted in favor
        mapping(address => bool) votes;  // Track who voted
    }

    uint public syllabusCount = 0;
    mapping(uint => Syllabus) public syllabi;

    // Events
    event SyllabusSubmitted(uint syllabusId, string cid, address institution);
    event SyllabusVoted(uint syllabusId, address voter);
    event SyllabusApproved(uint syllabusId);
    event NodeRegistered(address newNode);

    // Constructor
    constructor() {
        _setupRole(MINISTRY_ROLE, msg.sender);  // Grant deployer the MINISTRY_ROLE
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);  // Grant deployer admin role
    }

    // Register new node (university) by Ministry role
    function registerNode(address _newNode) public onlyRole(MINISTRY_ROLE) {
        grantRole(UNIVERSITY_ROLE, _newNode);
        registeredNodes.push(_newNode);
        emit NodeRegistered(_newNode);
    }

    // View the list of registered nodes
    function getRegisteredNodes() public view returns (address[] memory) {
        return registeredNodes;
    }

    // Submit a syllabus (6-month gap enforced)
    function submitSyllabus(string memory _cid) public onlyRole(UNIVERSITY_ROLE) {
        require(block.timestamp > lastApprovedTime[msg.sender] + 180 days, "Cannot propose a new syllabus yet");

        syllabusCount++;
        Syllabus storage newSyllabus = syllabi[syllabusCount];
        newSyllabus.id = syllabusCount;
        newSyllabus.cid = _cid;
        newSyllabus.institution = msg.sender;
        newSyllabus.voteCount = 0;
        newSyllabus.approved = false;
        newSyllabus.ministryVotedInFavor = false;

        emit SyllabusSubmitted(syllabusCount, _cid, msg.sender);
    }

    // Vote on a syllabus
    function voteOnSyllabus(uint _syllabusId) public {
        require(registeredNodes.length > 0, "No registered nodes to vote");
        
        Syllabus storage syllabus = syllabi[_syllabusId];
        require(!syllabus.votes[msg.sender], "Already voted on this syllabus");
        require(!syllabus.approved, "Syllabus already approved");

        if (hasRole(MINISTRY_ROLE, msg.sender)) {
            // Ministry votes in favor
            syllabus.ministryVotedInFavor = true;
        }

        syllabus.votes[msg.sender] = true;
        syllabus.voteCount++;

        emit SyllabusVoted(_syllabusId, msg.sender);

        // Check if Ministry voted in favor and if the number of votes exceeds the threshold
        if (syllabus.ministryVotedInFavor && syllabus.voteCount > registeredNodes.length / 2) {
            syllabus.approved = true;
            lastApprovedTime[syllabus.institution] = block.timestamp;  // Update the approval time
            emit SyllabusApproved(_syllabusId);
        }
    }

    // Update the approval threshold (by Ministry role)
    function updateApprovalThreshold(uint _newThreshold) public onlyRole(MINISTRY_ROLE) {
        approvalThreshold = _newThreshold;
    }

    // View the details of a syllabus
    function getSyllabus(uint _syllabusId) public view returns (string memory, address, uint, bool) {
        Syllabus storage syllabus = syllabi[_syllabusId];
        return (syllabus.cid, syllabus.institution, syllabus.voteCount, syllabus.approved);
    }
}
