const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DigitalNotary Contract", function () {
  let notary;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const DigitalNotary = await ethers.getContractFactory("DigitalNotary");
    notary = await DigitalNotary.deploy();
    await notary.waitForDeployment();
  });

  it("should notarize a document successfully", async function () {
    const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("Test Document Content"));
    const docName = "degree_certificate.pdf";

    await expect(notary.connect(addr1).notarizeDocument(sampleHash, docName))
      .to.emit(notary, "DocumentNotarized")
      .withArgs(sampleHash, docName, addr1.address, (await ethers.provider.getBlock("latest")).timestamp + 1);

    const [exists, timestamp, name, notarizedBy] = await notary.verifyDocument(sampleHash);
    expect(exists).to.be.true;
    expect(name).to.equal(docName);
    expect(notarizedBy).to.equal(addr1.address);
    expect(timestamp).to.be.greaterThan(0);
  });

  it("should fail when notarizing an already notarized document", async function () {
    const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("Duplicate Content"));
    await notary.notarizeDocument(sampleHash, "doc1.txt");

    await expect(
      notary.notarizeDocument(sampleHash, "doc1_modified_name.txt")
    ).to.be.revertedWith("Document has already been notarized");
  });

  it("should return exists = false for unnotarized document", async function () {
    const fakeHash = ethers.keccak256(ethers.toUtf8Bytes("Unregistered Document"));
    const [exists, timestamp, name, notarizedBy] = await notary.verifyDocument(fakeHash);

    expect(exists).to.be.false;
    expect(timestamp).to.equal(0n);
    expect(name).to.equal("");
    expect(notarizedBy).to.equal(ethers.ZeroAddress);
  });
});
