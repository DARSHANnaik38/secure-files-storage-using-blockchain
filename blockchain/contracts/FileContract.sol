// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileContract {

    struct File {
        string ipfsHash;
        uint fileSize;
        string fileName;
        uint uploadTimestamp;
    }

    mapping(address => File[]) public userFiles;

    event FileAdded(address indexed user, string ipfsHash, uint fileSize, string fileName);

    function addFile(string memory _ipfsHash, uint _fileSize, string memory _fileName) public {
        userFiles[msg.sender].push(File({
            ipfsHash: _ipfsHash,
            fileSize: _fileSize,
            fileName: _fileName,
            uploadTimestamp: block.timestamp
        }));

        emit FileAdded(msg.sender, _ipfsHash, _fileSize, _fileName);
    }

    function getFiles() public view returns (File[] memory) {
        return userFiles[msg.sender];
    }
}