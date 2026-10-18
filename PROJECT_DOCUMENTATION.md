# 📄 Digital Notary & Document Verification DApp
## Comprehensive Technical Project Report

> **Lead Developer:** **Aditya Kamble**  
> **Project Type:** College Term-Work Demonstration  
> **Domain:** Web3 / Blockchain / Applied Cryptography  
> **Network:** Ethereum Localhost (Hardhat EVM - Chain ID: `31337`)  
> **Smart Contract:** `DigitalNotary.sol` (Solidity `^0.8.20`)  
> **Date:** Academic Year 2026  

---

## 📌 Executive Summary & Problem Statement
In traditional document verification (degrees, marksheets, medical reports, certificates, property deeds):
* Verification is slow, manual, and vulnerable to human fraud.
* Regular digital PDFs can be easily manipulated using image editing tools (Photoshop) without visual artifacts.
* Centralized databases are single points of failure that can be hacked, wiped, or tampered with.

**The Solution — Cryptographic Proof-of-Existence (PoE):**
This DApp calculates a client-side SHA-256 hash (fingerprint) of any document and permanently records it on an Ethereum smart contract with an immutable block timestamp and creator address. Anyone can re-upload the document at any time to verify whether it matches the blockchain record with 100% cryptographic certainty.

---

## 🏗️ System Architecture: Where is Frontend, Backend & Blockchain?

Unlike traditional Web 2.0 applications (like MERN or Django with MySQL), this project employs a **decentralized, serverless Web3 architecture**:

| Component | Layer | Location & Files | Role & Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | Client-Side | `index.html`<br>`style.css`<br>`app.js` | Runs inside the user's browser. Hashes documents client-side using browser's native Web Crypto API (`window.crypto.subtle`). Communicates with the blockchain using Ethers.js. |
| **Backend** | Decentralized Backend | Hardhat EVM Node (`http://127.0.0.1:8545`) | **There is no traditional centralized server!** The Ethereum blockchain acts as the decentralized serverless backend. |
| **Smart Contract** | On-Chain Logic | `contracts/DigitalNotary.sol` | Contains immutable rules and state storage. Maps document hashes to verification records (`docName`, `timestamp`, `notarizedBy`). |
| **Tooling & Deploy** | Infrastructure | `hardhat.config.js`<br>`scripts/deploy.js` | Compiles Solidity into EVM bytecode, executes automated unit tests, and deploys contract to local testnet. |

---

## 🌐 Which Blockchain is Used & Why is it 100% Free?

### 1. Which Blockchain?
The application runs on an **Ethereum-compatible Virtual Machine (EVM) blockchain** simulated locally via **Hardhat Network**:
* **JSON-RPC Endpoint:** `http://127.0.0.1:8545`
* **Chain ID:** `31337` (standard local Hardhat testnet ID)
* **Consensus:** Instant block mining upon transaction broadcast.

### 2. Why is it 100% Free?
* **Local In-Memory EVM:** It runs locally in your computer's memory—no real Ethereum mainnet gas fees or fiat money (₹0 / $0).
* **Pre-Funded Test Accounts:** Hardhat automatically generates 20 test accounts with **10,000 test ETH** each to pay for local gas fees.
* **View Calls Cost 0 Gas:** The `verifyDocument(bytes32 docHash)` function is declared as a Solidity `view` function. Reading blockchain state never alters data, so verification costs **0 ETH**.

---

## 🔄 Complete Step-by-Step Workflow

### Step 1: Document Notarization (Proof of Existence)
1. **File Input:** User uploads or drags any document (PDF, PNG, DOCX) into the browser dropzone.
2. **Client-Side Hashing (Privacy Preserving):** The browser uses `crypto.subtle.digest('SHA-256', arrayBuffer)` to compute the 256-bit cryptographic digest.
   * *The file never leaves the user's machine! Only the 32-byte hash is sent to the blockchain.*
3. **Transaction Broadcast:** Ethers.js invokes `notarizeDocument(bytes32 docHash, string memory docName)`.
4. **Validation & Storage:** The smart contract checks `!documents[docHash].exists` to prevent duplicate notarizations, records the `block.timestamp` and `msg.sender`, and stores it into the persistent mapping.

### Step 2: Document Verification (Authenticity vs Tampering)
1. Verifier drops the document into the **Verify** tab.
2. The browser recalculates the SHA-256 digest.
3. Ethers.js calls the smart contract: `verifyDocument(bytes32 docHash)`.
4. **Evaluation:**
   * **If `exists == true`:** Returns 🟢 **'✅ Authentic Document'** showing timestamp, document title, and signer address.
   * **If `exists == false`:** Returns 🔴 **'❌ Unverified / Modified Document'**. Even if a single letter in the file was altered, the SHA-256 Avalanche Effect alters the hash completely, exposing any forgery.

---

## 💾 How Data is Stored: Why Hash instead of the Full PDF?

**Why don't we store the PDF on the blockchain?**
* Blockchains are designed for **consensus and verification**, not large file storage.
* Storing 1 MB on public Ethereum costs thousands of dollars in gas fees.
* A **SHA-256 hash is only 32 bytes (`bytes32`)**.
* Because SHA-256 has mathematical collision resistance (1 in $2^{256}$ probability of finding two identical hashes), storing a 32-byte hash guarantees 100% authenticity of even a 500-page document!

```solidity
struct Record {
    bytes32 docHash;        // 32-byte SHA-256 hash
    string docName;         // Label / file name
    uint256 timestamp;      // Block timestamp when certified
    address notarizedBy;    // Ethereum address of signer
    bool exists;            // Existence flag
}

mapping(bytes32 => Record) private documents;
```

---

## 🛠️ Languages & Technologies Used

| Technology | Category | Purpose |
| :--- | :--- | :--- |
| **Solidity (`0.8.20`)** | Smart Contract | Writing decentralized notarization logic |
| **Hardhat (`^2.22.0`)** | Dev Framework | Local blockchain, compiling, testing, deploying |
| **JavaScript (ES6+)** | Frontend Logic | Client-side application controller |
| **Ethers.js (`v6.13.2`)** | Web3 Integration | Connecting browser UI to Ethereum JSON-RPC node |
| **Web Crypto API** | Browser Security | Native high-speed client-side SHA-256 hashing |
| **HTML5 & CSS3** | Presentation | Responsive dark-mode glassmorphic user interface |
| **MetaMask** | Web3 Wallet | User key management and transaction signing |

---

## 🎓 Top 5 Viva / Oral Exam Questions & Winning Answers

### Q1: What is the Avalanche Effect in SHA-256?
> **Answer:** The Avalanche Effect is a fundamental property of cryptographic hash functions where changing even a single bit or punctuation mark in the input document results in an unpredictable, radically different output hash (>50% of bits flip). This is why modified documents immediately fail verification.

### Q2: Why is the smart contract backend considered "trustless"?
> **Answer:** It is trustless because users do not have to trust a central company, server administrator, or database admin. The smart contract logic is public, deterministic, immutable, and enforced automatically by blockchain consensus.

### Q3: How do you prevent duplicate notarizations?
> **Answer:** In `DigitalNotary.sol`, we check `require(!documents[docHash].exists, "Document has already been notarized");`. If the same file is submitted again, the transaction reverts and prevents timestamp overwriting.

### Q4: Does the blockchain store the actual file content?
> **Answer:** No. It only stores the 32-byte cryptographic hash (`bytes32`), the document title, timestamp, and issuer address. The actual file stays private on the owner's machine.

### Q5: Can anyone delete or edit a notarization record once mined?
> **Answer:** No. Blockchains are immutable append-only state machines. The contract does not have any deletion or modification functions, meaning records are permanent forever.

---

## 🚀 Step-by-Step Terminal Commands to Start Project

```bash
# 1. Install dependencies
npm install

# 2. Run automated tests (3 passing)
npx hardhat test

# 3. Start local blockchain node (Terminal 1)
npx hardhat node

# 4. Deploy smart contract to localhost (Terminal 2)
npx hardhat run scripts/deploy.js --network localhost

# 5. Launch web application
npx serve . -l 3000
```
Open **`http://localhost:3000`** in any web browser.

---

*Report Created for College Term-Work Demonstration • Developed by **Aditya Kamble***
