// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;

    struct Party {
        string candidateName;
        string partyName;
        string symbolPath;
        string state;
        string zip;
        uint voteCount;
    }

    mapping(uint => Party) public parties;
    uint public partyCount;

    mapping(string => bool) private usedAadharNumbers;

    event AdminSet(address indexed newAdmin);
    event PartyAdded(uint indexed partyId, string candidateName, string partyName);
    event VoteCasted(address indexed voter, uint indexed partyId, string aadharNumber);

    constructor() {
        admin = msg.sender;
        emit AdminSet(admin);
    }

    function setAdmin(address _newAdmin) public {
        require(msg.sender == admin, "Only the current admin can set a new admin");
        admin = _newAdmin;
        emit AdminSet(_newAdmin);
    }

    function addParty(
        string memory _candidateName,
        string memory _partyName,
        string memory _symbolPath,
        string memory _state,
        string memory _zip
    ) public {
        require(msg.sender == admin, "Only admin can add parties");
        partyCount++;
        parties[partyCount] = Party(_candidateName, _partyName, _symbolPath, _state, _zip, 0);
        emit PartyAdded(partyCount, _candidateName, _partyName);
    }

    function getParty(uint _partyId) public view returns (
        string memory candidateName,
        string memory partyName,
        string memory symbolPath,
        string memory state,
        string memory zip,
        uint voteCount
    ) {
        Party memory party = parties[_partyId];
        return (party.candidateName, party.partyName, party.symbolPath, party.state, party.zip, party.voteCount);
    }

    function vote(uint _partyId, string memory _aadharNumber) public {
        require(!usedAadharNumbers[_aadharNumber], "Aadhaar number has already been used to vote");
        require(_partyId > 0 && _partyId <= partyCount, "Invalid party ID");
        
        usedAadharNumbers[_aadharNumber] = true;
        parties[_partyId].voteCount++;
        emit VoteCasted(msg.sender, _partyId, _aadharNumber);
    }

    function getTotalVotes(uint _partyId) public view returns (uint) {
        require(_partyId > 0 && _partyId <= partyCount, "Invalid party ID");
        return parties[_partyId].voteCount;
    }
}
