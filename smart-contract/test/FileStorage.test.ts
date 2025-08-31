import { expect } from "chai";
import { ethers } from "hardhat";
// Import the specific type for your contract
import { FileStorage } from "../typechain-types";

describe("FileStorage", function () {
  // Declare the variable with the specific contract type
  let fileStorage: FileStorage;
  let owner: any;

  // This hook runs before each test, deploying a new contract instance
  beforeEach(async function () {
    // Get a test user account
    [owner] = await ethers.getSigners();

    // Deploy the contract
    const FileStorageFactory = await ethers.getContractFactory("FileStorage");
    fileStorage = await FileStorageFactory.deploy();
  });

  it("Should allow a user to add a file and retrieve it", async function () {
    // Sample file data
    const fileHash = "QmXyZ...aBcD";
    const fileSize = 1024;
    const fileName = "my-document.txt";

    // Call the addFile function
    await fileStorage.connect(owner).addFile(fileHash, fileSize, fileName);

    // Call the getFiles function
    const userFiles = await fileStorage.connect(owner).getFiles();

    // Check if the data was stored correctly
    expect(userFiles.length).to.equal(1);
    expect(userFiles[0].fileHash).to.equal(fileHash);
    expect(userFiles[0].fileName).to.equal(fileName);
    expect(userFiles[0].uploader).to.equal(owner.address);
  });
});
