// test/Voting.test.js
const { expect } = require("chai");

describe("Voting Contract", function () {
    let voting;
    let admin;

    beforeEach(async function () {
        const Voting = await ethers.getContractFactory("Voting");
        voting = await Voting.deploy();
        await voting.deployed();
        [admin] = await ethers.getSigners();
    });

    it("should add a candidate", async function () {
        await voting.addCandidate("Alice", "Party A", "District 1");
        const candidate = await voting.candidates(1);
        expect(candidate.name).to.equal("Alice");
        expect(candidate.party).to.equal("Party A");
        expect(candidate.district).to.equal("District 1");
    });
});
