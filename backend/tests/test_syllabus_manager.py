import pytest
from brownie import SyllabusManager, accounts, reverts

@pytest.fixture
def syllabus_manager():
    # Deploy the SyllabusManager contract and set the deployer as the Ministry
    return SyllabusManager.deploy({'from': accounts[0]})  # accounts[0] is the Ministry of Education

def test_register_node(syllabus_manager):
    # Ministry of Education (accounts[0]) registers a new university (accounts[1])
    syllabus_manager.registerNode(accounts[1], {'from': accounts[0]})

    # Check that the new university has the UNIVERSITY_ROLE
    assert syllabus_manager.hasRole(syllabus_manager.UNIVERSITY_ROLE(), accounts[1]) == True

def test_submit_syllabus(syllabus_manager):
    # Register university (accounts[1])
    syllabus_manager.registerNode(accounts[1], {'from': accounts[0]})

    # University submits a syllabus
    tx = syllabus_manager.submitSyllabus("QmTestCID", {'from': accounts[1]})

    # Verify the event was emitted
    assert "SyllabusSubmitted" in tx.events
    syllabus_id = tx.events["SyllabusSubmitted"]["syllabusId"]

    # Check that the syllabus data is correct
    cid, institution, vote_count, approved = syllabus_manager.getSyllabus(syllabus_id)
    assert cid == "QmTestCID"
    assert institution == accounts[1]
    assert vote_count == 0
    assert approved == False

def test_voting_and_approval(syllabus_manager):
    # Register 3 universities (accounts[1], accounts[2], accounts[3])
    syllabus_manager.registerNode(accounts[1], {'from': accounts[0]})
    syllabus_manager.registerNode(accounts[2], {'from': accounts[0]})
    syllabus_manager.registerNode(accounts[3], {'from': accounts[0]})

    # University (accounts[1]) submits a syllabus
    tx = syllabus_manager.submitSyllabus("QmTestCID", {'from': accounts[1]})
    syllabus_id = tx.events["SyllabusSubmitted"]["syllabusId"]

    # Voting process - Each node votes on the syllabus
    syllabus_manager.voteOnSyllabus(syllabus_id, {'from': accounts[1]})
    syllabus_manager.voteOnSyllabus(syllabus_id, {'from': accounts[2]})

    # Verify vote count but syllabus is not yet approved (threshold is 3 votes)
    _, _, vote_count, approved = syllabus_manager.getSyllabus(syllabus_id)
    assert vote_count == 2
    assert approved == False

    # Third vote should approve the syllabus
    syllabus_manager.voteOnSyllabus(syllabus_id, {'from': accounts[3]})

    # Check if the syllabus is approved
    _, _, vote_count, approved = syllabus_manager.getSyllabus(syllabus_id)
    assert vote_count == 3
    assert approved == True

def test_voting_once_per_node(syllabus_manager):
    # Register a university (accounts[1])
    syllabus_manager.registerNode(accounts[1], {'from': accounts[0]})

    # University submits a syllabus
    tx = syllabus_manager.submitSyllabus("QmTestCID", {'from': accounts[1]})
    syllabus_id = tx.events["SyllabusSubmitted"]["syllabusId"]

    # Vote on the syllabus once
    syllabus_manager.voteOnSyllabus(syllabus_id, {'from': accounts[1]})

    # Attempt to vote again - should fail
    with reverts("Already voted on this syllabus"):
        syllabus_manager.voteOnSyllabus(syllabus_id, {'from': accounts[1]})

def test_ministry_can_update_threshold(syllabus_manager):
    # Verify the initial threshold
    assert syllabus_manager.approvalThreshold() == 3
    
    # Ministry updates the threshold to 5
    syllabus_manager.updateApprovalThreshold(5, {'from': accounts[0]})
    
    # Verify the updated threshold
    assert syllabus_manager.approvalThreshold() == 5
    
    # Non-ministry account tries to update threshold - should fail
    with reverts():  # No need to specify the exact revert message
        syllabus_manager.updateApprovalThreshold(2, {'from': accounts[1]})
