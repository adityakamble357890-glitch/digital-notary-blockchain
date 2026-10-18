# 📜 Digital Notary & Document Verification DApp

> **Author / Developer:** **Aditya Kamble**  
> **Course / Purpose:** College Term-Work Demonstration  
> **Tech Stack:** Solidity, Ethereum, Hardhat, Ethers.js, HTML5/CSS3 (Native Web Crypto API)

A lightweight, fully functional decentralized application for document notarization and integrity verification built on the Ethereum blockchain for a college term-work demonstration.

---

## 🌟 Key Features

1. **Smart Contract (`DigitalNotary.sol`):**
   - Written in Solidity `^0.8.20`.
   - `notarizeDocument(bytes32 docHash, string memory docName)`: Stores the document's cryptographic hash, title, sender address, and block timestamp on-chain.
   - `verifyDocument(bytes32 docHash)`: Checks if a document exists and returns its timestamp, document title, and issuer address.
   - Prevents duplicate notarizations and emits `DocumentNotarized` events.

2. **Frontend Interface (`index.html` + `app.js` + `style.css`):**
   - Modern, responsive dark-mode UI with glassmorphic styling and smooth animations.
   - **Client-Side SHA-256 Hashing:** Uses the native browser Web Cryptography API (`crypto.subtle.digest`) so files never leave the user's machine.
   - **Notarize Section:** Drag-and-drop or select any file, view its calculated 32-byte hash (`0x...`), and record it on the blockchain with MetaMask.
   - **Verify Section:** Upload a file to re-hash and query the smart contract:
     - 🟢 **'✅ Authentic Document'** banner with notarization timestamp, document title, and signer wallet address.
     - 🔴 **'❌ Unverified / Modified Document'** banner if a single character or byte in the file has been altered or never recorded.
   - Includes a **"Generate Sample Degree.pdf"** button for instant live presentation.

---

## 📁 Project Structure

```text
blockchain/
├── contracts/
│   └── DigitalNotary.sol     # Solidity Smart Contract
├── scripts/
│   └── deploy.js             # Hardhat deployment script & config exporter
├── test/
│   └── DigitalNotary.test.js # Automated Hardhat test suite
├── index.html                # Single-page frontend
├── app.js                    # Web Crypto Hashing & Ethers.js / MetaMask logic
├── style.css                 # Responsive UI styles
├── hardhat.config.js         # Hardhat network & compiler configuration
├── package.json              # Project dependencies and run scripts
└── README.md                 # Setup & presentation guide
```

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### Step 2: Start the Local Hardhat Blockchain Node
Start the local Ethereum testnet with 20 pre-funded test accounts:
```bash
npx hardhat node
```
> 💡 *Keep this terminal window open. It will run at `http://127.0.0.1:8545` with Chain ID `31337`.*

---

### Step 3: Deploy the Smart Contract
Open a **second terminal window** in the same project directory and run:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

Upon successful deployment, the script outputs:
```text
✨ DigitalNotary deployed successfully!
📍 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
💾 Frontend config saved to contract-config.json
```

---

### Step 4: Configure MetaMask

1. Open your MetaMask browser extension.
2. Add the Hardhat local network (if not already added):
   - **Network Name:** Hardhat Localhost
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
3. Import a test account from the terminal output of `npx hardhat node` using its Private Key (e.g. Account #0 has 10,000 test ETH).

---

### Step 5: Launch the Frontend & Demo

You can simply open `index.html` in your web browser:
- Double click `index.html` **OR**
- Start a local server:
```bash
c
```
and open `http://localhost:3000` in your browser.

---

## 🎓 How to Present to Your Teacher / Examiner

1. **Explain the Architecture:**
   - Files are **never uploaded to the blockchain** (which is prohibitively expensive).
   - Instead, the browser calculates the **SHA-256 cryptographic digest** of the file locally.
   - Only the 32-byte hash (`bytes32`), document label, and timestamp are written to the smart contract.

2. **Demonstrate Notarization (Proof-of-Existence):**
   - Click **"Connect Wallet"** to connect MetaMask.
   - Click **"Generate Sample Degree.pdf"** (or upload your college PDF/image).
   - Show how the SHA-256 hash is computed in real-time.
   - Click **"Notarize on Blockchain"** and confirm the transaction in MetaMask.
   - Show the block confirmation and transaction hash in the Hardhat terminal.

3. **Demonstrate Successful Verification (Authenticity):**
   - Switch to the **Verify Document** tab.
   - Upload the exact same file.
   - Click **"Verify on Blockchain"**.
   - Show the green **'✅ Authentic Document'** card displaying the exact timestamp and issuer address.

4. **Demonstrate Tamper Detection (The "Aha!" Moment):**
   - Open the sample file in Notepad or an editor, change a single character (e.g., change year from 2026 to 2025), and save it.
   - Upload the modified file into the **Verify** section.
   - Click **"Verify on Blockchain"**.
   - Show the red **'❌ Unverified / Modified Document'** warning, proving cryptographic avalanche effect and blockchain tamper-proof integrity!

---

## 🧪 Running Automated Tests
To run the contract test suite:
```bash
npx hardhat test
```

---

## 👨‍💻 Project Credits
* **Project Lead & Developer:** **Aditya Kamble**
* **Project Type:** College Term-Work Demonstration
* **Repository:** Digital Notary & Document Verification DApp

