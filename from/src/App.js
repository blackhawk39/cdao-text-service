import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Replace with your contract's ABI and address
const CONTRACT_ADDRESS = '0x29536E9a38f42b8dc28EA77933c12D0b19452C43';
// const CONTRACT_ABI = [
//   // Add your contract's ABI here
// ];

import AskAround from "./contracts/AskAround.sol/AskAround.json"

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
