// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// A simple contract to store file metadata
contract FileStorage {
    // A structure to hold information about each file
    struct File {
        string fileHash;    // The unique hash of the file (e.g., from IPFS)
        uint256 fileSize;   // File size in bytes
        string fileName;    // The original name of the file
        uint256 uploadTime; // Timestamp of when the file was added
        address uploader;   // The address of the user who uploaded it
    }

    // Mapping from a user's address to an array of their files
    mapping(address => File[]) private userFiles;

    /**
     * @dev Adds file metadata to the blockchain.
     */
    function addFile(
        string memory _fileHash,
        uint256 _fileSize,
        string memory _fileName
    ) public {
        // Ensure the file hash is not empty
        require(bytes(_fileHash).length > 0, "File hash cannot be empty");

        // Add the new file to the sender's list of files
        userFiles[msg.sender].push(File({
            fileHash: _fileHash,
            fileSize: _fileSize,
            fileName: _fileName,
            uploadTime: block.timestamp,
            uploader: msg.sender
        }));
    }

    /**
     * @dev Retrieves all file metadata for the calling user.
     */
    function getFiles() public view returns (File[] memory) {
        return userFiles[msg.sender];
    }
}