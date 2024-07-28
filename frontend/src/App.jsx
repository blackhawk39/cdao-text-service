// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Login from "./components/Login";
// import Layout from "./Layout";
// import Messages from "./components/Messages";
// import Chat from "./components/Chat";
// import AskAround from "../../artifacts/contracts/AskAround.sol/AskAround.json"
// import SocialToken from "../../artifacts/contracts/SocialToken.sol/SocialToken.json"
// import { ethers } from 'ethers';


// const askAroundAddress = '0x7F15ab8c28DDaBC1b8840d3d3658C7549ed2f99B';
// const socialTokenAddress = '0x26E3F3259EF1e94b96E5EFCA875EDf90c63A1DA3'; 

// function App() {

//   const [currentAccount, setCurrentAccount] = useState(null);
//   // Check if wallet is connected
//   const checkWalletIsConnected = async () => {
//     const { ethereum } = window;

//     if (!ethereum) {
//       console.log('Make sure you have Metamask installed!');
//       return;
//     }

//     try {
//       const accounts = await ethereum.request({ method: 'eth_accounts' });

//       if (accounts.length !== 0) {
//         const account = accounts[0];
//         setCurrentAccount(account);
//       } else {
//         console.log('No authorized account found');
//       }
//     } catch (error) {
//       console.error('Error fetching accounts:', error);
//     }
//   };

//   // Check network
//   const checkNetwork = async () => {
//     const { ethereum } = window;

//     if (!ethereum) {
//       console.log('Ethereum object does not exist');
//       return;
//     }

//     try {
//       const provider = new ethers.providers.Web3Provider(ethereum);
//       const { chainId } = await provider.getNetwork();

//       if (chainId !== 1115) {
//         alert('Please connect to the Core Testnet');
//       } else {
//         setNetwork('Core Testnet');
//       }
//     } catch (error) {
//       console.error('Error fetching network:', error);
//     }
//   };

//   // Connect wallet
//   const connectWalletHandler = async () => {
//     const { ethereum } = window;

//     if (!ethereum) {
//       alert('Please install Metamask!');
//       return;
//     }

//     try {
//       const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
//       setCurrentAccount(accounts[0]);
//     } catch (error) {
//       console.error('Error connecting wallet:', error);
//     }
//   };

//   // Disconnect wallet
//   const disconnectWalletHandler = () => {
//     setCurrentAccount(null);
//     setStakedAmount('0');
//     setRewardAmount('0');
//     setTotalStkBalance('0');
//     setNetwork('');
//   };  
//   // return (
//   //   <>
//   //     <BrowserRouter>
//   //       <Routes>
//   //         <Route path="/" element={<Layout />}>
//   //           <Route index element={<Login />} />
//   //           <Route path="/inbox" element={<Messages />} />
//   //           <Route path="/chat" element={<Chat />} />
//   //         </Route>
//   //       </Routes>
//   //     </BrowserRouter>
//   // //   </>
//   // );
//   return (
//     <div className="App">
//       <header className="App-header">
//         <button onClick={fetchPhoneNumber}>Fetch Phone Number</button>
//         <button onClick={updatePhoneNumber}>Update Phone Number</button>
//         <input
//           onChange={(e) => setPhoneNumber(e.target.value)}
//           placeholder="Enter phone number"
//           value={phoneNumber}
//         />
//       </header>
//       <div>{phoneNumber}</div>
//     </div>
//   );

// }

// export default App;

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';


// / const askAroundAddress = '0x7F15ab8c28DDaBC1b8840d3d3658C7549ed2f99B';
import AskAround from "../../artifacts/contracts/AskAround.sol/AskAround.json"
// const socialTokenAddress = '0x26E3F3259EF1e94b96E5EFCA875EDf90c63A1DA3'; 
// Replace with your contract's ABI and address
const CONTRACT_ADDRESS = '0x7F15ab8c28DDaBC1b8840d3d3658C7549ed2f99B';
// const CONTRACT_ABI = [
// ];

const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [userRegistered, setUserRegistered] = useState(false);
  const [userName, setUserName] = useState('');
  const [tag, setTag] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const initializeEthers = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const signer = provider.getSigner();
        setSigner(signer);

        const contract = new ethers.Contract(CONTRACT_ADDRESS, AskAround.abi, signer);
        setContract(contract);
      } else {
        console.log('Ethereum wallet not detected');
      }
    };

    initializeEthers();
  }, []);

  const registerUser = async () => {
    if (contract && userName) {
      try {
        const tx = await contract.registerUser(userName);
        await tx.wait();
        console.log('User registered successfully');
        setUserRegistered(true);
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  };

  const addQuestionToTag = async () => {
    if (contract && userRegistered && tag && questionId) {
      try {
        const tx = await contract.addQuestionToTag(tag, ethers.BigNumber.from(questionId));
        await tx.wait();
        console.log('Question added successfully');
      } catch (error) {
        console.error('Error adding question:', error);
      }
    } else {
      console.log('User must be registered to add a question');
    }
  };

  const getQuestionsByTag = async () => {
    if (contract && tag) {
      try {
        const questions = await contract.tagToQuestions(tag);
        setQuestions(questions.map(q => q.toString()));
      } catch (error) {
        console.error('Error retrieving questions:', error);
      }
    }
  };

  return (
    <div>
      <h1>AskAround DApp</h1>
      <div>
        <h2>Register User</h2>
        <input
          type="text"
          placeholder="Name"
          value={userName}
          onChange={e => setUserName(e.target.value)}
        />
        <button onClick={registerUser}>Register</button>
      </div>
      <div>
        <h2>Add Question to Tag</h2>
        <input
          type="text"
          placeholder="Tag"
          value={tag}
          onChange={e => setTag(e.target.value.toUpperCase())} // Ensure tag is uppercase
        />
        <input
          type="number"
          placeholder="Question ID"
          value={questionId}
          onChange={e => setQuestionId(e.target.value)}
        />
        <button onClick={addQuestionToTag}>Add Question</button>
      </div>
      <div>
        <h2>Get Questions by Tag</h2>
        <input
          type="text"
          placeholder="Tag"
          value={tag}
          onChange={e => setTag(e.target.value.toUpperCase())} // Ensure tag is uppercase
        />
        <button onClick={getQuestionsByTag}>Get Questions</button>
        <ul>
          {questions.map((q, index) => (
            <li key={index}>{q}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
