import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AskAround from "./contracts/AskAround.sol/AskAround.json"
import SocialToken from "./contracts/SocialToken.sol/SocialToken.json"
// Replace with your contract's ABI and address
// const CONTRACT_ADDRESS = '0x1559f6b38Fd2E80Db497cFD601df3A75bc366Be0';
const CONTRACT_ADDRESS = '0x87752c7d9679B5c3D677c1a72A4A11F9C17aA22C';
const TOKEN_ADDRESS = '0xAf790fABCf6253D1D621D1bdF04C94060Dc01B2E'


const App = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [userRegistered, setUserRegistered] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // To manage page navigation
  const [tagName, setTagName] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [newTag, setNewTag] = useState('');
  const [removeTag, setRemoveTag] = useState('');
  const [balance, setBalance] = useState(0);
  const [allTags, setAllTags] = useState([]);
  const [ListQuestions, setListQuestions] = useState([]);
  const [QuestionsIdByTag, setQuestionsIdByTag] = useState([]);
  const [bestAnswerCount, setBestAnswerCount] = useState(0);
  const [questionDetails, setQuestionDetails] = useState({
    asker: '',
    content: '',
    timestamp: 0,
    tag: '',
    bestAnswerId: 0,
  });
  const [reward, setReward] = useState(0);
  useEffect(() => {
    const initializeEthers = async () => {
      if (window.ethereum) {
        // console.log('Ethereum wallet detected');
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // setProvider(provider);

        // const signer = provider.getSigner();
        // setSigner(signer);

        // const contract = new ethers.Contract(CONTRACT_ADDRESS, AskAround.abi, signer);
        // setContract(contract);
        
        // Request account access if needed
    window.ethereum.request({ method: 'eth_requestAccounts' })
    .then(accounts => {
        // Get the first account
        const account = accounts[0];
        console.log("Connected account:", account);

        // Create an ethers provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        // Create a signer
        const signer = provider.getSigner();
        setSigner(signer);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, AskAround.abi, signer);
        setContract(contract);
        // Now you can use the provider and signer
        console.log("Provider and signer set up successfully");
    })
    .catch((error) => {
        console.error("User rejected the request:", error);
    });
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
        setCurrentPage(1);
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  };

  const addTag = async () => {
    if (contract && newTag) {
      try {
        const tx = await contract.addTag(newTag,{ value: ethers.utils.parseEther("0.01") });
        await tx.wait();
        console.log('Tag added successfully');
      } catch (error) {
        console.error('Error adding tag:', error);
        alert('Error adding tag: ' + error.message);
      }
    }
  };

  const removeaTag = async () => {
    if (contract && removeTag) {
      try {
        const tx = await contract.removeaTag(removeTag);
        await tx.wait();
        console.log('Tag removed successfully');
      } catch (error) {
        console.error('Error removing tag:', error);
        alert('Error removing tag: ' + error.message);
      }
    }
  };

  const askQuestion = async () => {
    if (contract && tagName && questionContent) {
      try {
        // await tokenContract.approve(stakingDappAddress, ethers.utils.parseUnits(stakingAmount, stakingTokenDecimals));
        // const tx = await stakingDappContract.stake(ethers.utils.parseUnits(stakingAmount, stakingTokenDecimals));
        // await tx.wait();
        const tx = await contract.askQuestion(questionContent, tagName);
        await tx.wait();
        console.log('Question asked successfully');
      } catch (error) {
        console.error('Error asking question:', error);
        alert('Error asking question: ' + error.message);
      }
    }
  };

  const getQuestionsByTag = async () => {
    if (contract && searchTag) {
      try {
        const questions = await contract.getQuestionsByTag(searchTag);
        setQuestions(questions.map(q => q.toString()));
      } catch (error) {
        console.error('Error retrieving questions:', error);
      }
    }
  };

  const getAnswersByQuestionId = async (questionId) => {
    if (contract && questionId) {
      try {
        const answers = await contract.getAnswers(parseInt(questionId));
        setAnswers(answers.map(a => a.toString()));
        setSelectedQuestionId(parseInt(questionId));
        setCurrentPage(3);
      } catch (error) {
        console.error('Error retrieving answers:', error);
      }
    }
  };

  const submitAnswer = async () => {
    if (contract && newAnswer) {
      try {
        const tx = await contract.submitAnswer(selectedQuestionId, newAnswer);
        await tx.wait();
        console.log('Answer submitted successfully');
        setAnswers([...answers, newAnswer]);
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    }
    else{
      console.log(contract);
      console.log(selectedQuestionId);
      console.log(newAnswer);

    }
  };
  async function getTokenBalance() {
    const tokenContract = new ethers.Contract(TOKEN_ADDRESS, SocialToken, signer);
    const userAddress = await signer.getAddress();
    try {
      const balance = await tokenContract.balanceOf(userAddress);
      setBalance(ethers.utils.formatUnits(balance, 18));
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  }

  const getTagKeys = async () => {
    if (contract) {
      try {
        const tags = await contract.getTagKeys();
        setAllTags(tags);
        console.log('Tags Fetched');
      } catch (error) {
        console.error('Error fetchingh tag:', error);
      }
    }
  };
  const getUser = async (userAddress) => {
    if (contract && userAddress ) {
      try {
        const [name, questions] = await contract.getUser(userAddress);
        setUserName(name);
        setListQuestions(questions);
        console.log('user Fetched');
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
  };
  const getQuestion = async (questionId) => {
    if (contract && questionId) {
      try {
        const [asker, content, timestamp, tag, bestAnswerId]  = await contract.getQuestion(questionId);
        setQuestionDetails({
          asker,
          content,
          timestamp: new Date(timestamp.toNumber() * 1000).toLocaleString(),
          tag,
          bestAnswerId: bestAnswerId.toString(),
        });
        console.log('Question Fetched');
      } catch (error) {
        console.error('Error fetchingh Question:', error);
      }
    }
  };
  const getQuestionsIdByTag = async (tag) => {
    if (contract && tag) {
      try {
        const questionIds = await contract.getQuestion();
        setQuestionsIdByTag(questionIds);
        console.log('Question ids fetched');
      } catch (error) {
        console.error('Error fetchingh Question ids:', error);
      }
    }
  };

  const getBestAnswerCount = async (tag) => {
    if (contract && tag) {
      try {
        const userAddress = await signer.getAddress();
        const count = await contract.getBestAnswerCount(userAddress, tag);
        setBestAnswerCount(count.toString());
        console.log('getBestAnswerCount Fetched');
      } catch (error) {
        console.error('Error fetching getBestAnswerCount:', error);
      }
    }
  };
  const getCurrentReward = async (tag) => {
    if (contract && tag) {
      try {
        const count = await contract.getCurrentReward(tag);
        setReward(count);
        console.log('getCurrentReward Fetched');
      } catch (error) {
        console.error('Error fetching getCurrentReward:', error);
      }
    }
  };
  

  



  const renderRegisterPage = () => (
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
  );

  const renderForumPage = () => (
    <div>
      <h2>Add a Tag</h2>
      <input
        type="text"
        placeholder="Tag Name"
        value={newTag}
        onChange={e => setNewTag(e.target.value.toUpperCase())} // Ensure tag is uppercase
      />
      <button onClick={addTag}>Add Tag</button>

      <h2>Remove a Tag</h2>
      <input
        type="text"
        placeholder="Tag Name"
        value={removeTag}
        onChange={e => setRemoveTag(e.target.value.toUpperCase())} // Ensure tag is uppercase
      />
      <button onClick={removeaTag}>Remove Tag</button>

      <h2>Ask a Question</h2>
      <input
        type="text"
        placeholder="Tag Name"
        value={tagName}
        onChange={e => setTagName(e.target.value.toUpperCase())} // Ensure tag is uppercase
      />
      <textarea
        placeholder="Question Content"
        value={questionContent}
        onChange={e => setQuestionContent(e.target.value)}
      />
      <button onClick={askQuestion}>Submit Question</button>

      <h2>Search Tags</h2>
      <input
        type="text"
        placeholder="Search Tag"
        value={searchTag}
        onChange={e => setSearchTag(e.target.value.toUpperCase())} // Ensure tag is uppercase
      />
      <button onClick={getQuestionsByTag}>Search</button>
      <ul>
        {questions.map((q, index) => (
          <li key={index} onClick={() => getAnswersByQuestionId(q[0])}>{q}</li>
        ))}
      </ul>
    </div>
  );

  const renderQuestionPage = () => (
    <div>
      <h2>Answers for Question ID: {selectedQuestionId}</h2>
      <ul>
        {answers.map((a, index) => (
          <li key={index}>{a}</li>
        ))}
      </ul>
      <textarea
        placeholder="Your Answer"
        value={newAnswer}
        onChange={e => setNewAnswer(e.target.value)}
      />
      <button onClick={submitAnswer}>Submit Answer</button>
    </div>
  );

  return (
    <div>
      <h1>AskAround DApp</h1>
      {currentPage === 0 && renderRegisterPage()}
      {currentPage === 1 && renderForumPage()}
      {currentPage === 3 && renderQuestionPage()}
    </div>
  );
};


export default App;