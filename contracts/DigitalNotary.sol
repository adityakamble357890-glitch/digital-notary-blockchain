// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DigitalNotary
 * @author Aditya Kamble
 * @dev Smart contract for notarizing and verifying document integrity on the blockchain.
 * College Term-Work Demonstration.
 */
contract DigitalNotary {
    struct Record {
        bytes32 docHash;
        string docName;
        uint256 timestamp;
        address notarizedBy;
        bool exists;
    }

    // Mapping from document SHA-256 hash to its notarization record
    mapping(bytes32 => Record) private documents;

    // Array of recorded document hashes for audit trail / history
    bytes32[] private documentList;

    // Events
    event DocumentNotarized(
        bytes32 indexed docHash,
        string docName,
        address indexed notarizedBy,
        uint256 timestamp
    );

    /**
     * @notice Notarizes a document with its SHA-256 hash and title
     * @param docHash The 32-byte cryptographic hash (SHA-256) of the document
     * @param docName A friendly label or filename for the document
     */
    function notarizeDocument(bytes32 docHash, string memory docName) external {
        require(docHash != bytes32(0), "Invalid document hash");
        require(!documents[docHash].exists, "Document has already been notarized");
        require(bytes(docName).length > 0, "Document name cannot be empty");

        documents[docHash] = Record({
            docHash: docHash,
            docName: docName,
            timestamp: block.timestamp,
            notarizedBy: msg.sender,
            exists: true
        });

        documentList.push(docHash);

        emit DocumentNotarized(docHash, docName, msg.sender, block.timestamp);
    }

    /**
     * @notice Verifies whether a document hash exists on-chain and retrieves its notarization details
     * @param docHash The 32-byte cryptographic hash of the document to verify
     * @return exists Boolean indicating if document is authentic and notarized
     * @return timestamp The UNIX timestamp when the document was notarized (0 if not found)
     * @return docName The name/label associated with the document
     * @return notarizedBy The Ethereum address of the wallet that notarized the document
     */
    function verifyDocument(bytes32 docHash)
        external
        view
        returns (
            bool exists,
            uint256 timestamp,
            string memory docName,
            address notarizedBy
        )
    {
        Record memory doc = documents[docHash];
        return (doc.exists, doc.timestamp, doc.docName, doc.notarizedBy);
    }

    /**
     * @notice Returns total number of documents notarized
     */
    function getTotalDocuments() external view returns (uint256) {
        return documentList.length;
    }

    /**
     * @notice Retrieves document hash by index
     */
    function getDocumentHashAtIndex(uint256 index) external view returns (bytes32) {
        require(index < documentList.length, "Index out of bounds");
        return documentList[index];
    }
}
