import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import Uploadabi from './artifacts/contracts/Upload.sol/Upload.json';
import Navbar from './Navbar';
import Share from './Share';
import GiveAccess from './GiveAccess';
import Upload from './Upload';
import ViewCertificates from './ViewCertificates';
import Verify from './Verify';
import CancelAccess from './CancelAccess';

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      if (!window.ethereum) {
        console.error("MetaMask is not installed.");
        alert("Please install or enable MetaMask and refresh the page.");
        return;
      }

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      await web3Provider.send("eth_requestAccounts", []);
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      setProvider(web3Provider);
      setSigner(signer);
      setAccount(address);

      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace with actual deployed address
      const uploadContract = new ethers.Contract(
        contractAddress,
        Uploadabi.abi,
        signer
      );

      setContract(uploadContract);

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
    };

    loadProvider();
  }, []);

  return (
    <>
      <div className="App">
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={<Home account={account} provider={provider} />}
          />
          <Route
            path="/share"
            element={
              <Share
                contract={contract}
                account={account}
                provider={provider}
                signer={signer}
              />
            }
          />
          <Route
            path="/giveaccess"
            element={<GiveAccess contract={contract} />}
          />
          <Route
            path="/upload"
            element={
              <Upload contract={contract} account={account} provider={provider} />
            }
          />
          <Route
            path="/viewcertificates"
            element={<ViewCertificates contract={contract} account={account} />}
          />
          <Route path="/verify" element={<Verify />} />
          <Route
            path="/cancelaccess"
            element={<CancelAccess contract={contract} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
