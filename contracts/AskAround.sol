// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract AskAround is Ownable, ReentrancyGuard {
    struct Question {
        address asker;
        string content;
        string tag;
        bool answered;
        uint256 bestAnswerId;
    }

    struct Answer {
        address answerer;
        string content;
    }

    struct User {
        string name;
        uint256[] questions;
    }

    struct Tag {
        uint256 userCount;
    }

    struct UserTag {
        bool exists;
        uint256 timestamp;
        uint256 lastClaimed;
        uint256 bestAnswerCount; // Track best answer count for this tag
    }

    uint256 public constant TAG_STAKE_AMOUNT = 0.01 ether;
    uint256 public constant REWARD_FOR_QUESTION = 10 * 10 ** 18; // 10 SOC tokens
    uint256 public constant REWARD_FOR_ANSWER = 5 * 10 ** 18; // 5 SOC tokens
    uint256 public constant BEST_ANSWER_REWARD = 50 * 10 ** 18; // 50 SOC tokens
    uint256 public constant ONE_MONTH = 30 days;
    uint256 public constant MAX_TAG_LENGTH = 10;

    IERC20 public token;

    mapping(address => User) public users;
    Question[] public questions;
    mapping(uint256 => Answer[]) public answers;
    mapping(string => Tag) public tags;
    mapping(address => mapping(string => UserTag)) public userTags;
    mapping(address => uint256) public stakes;
    mapping(string => uint256[]) public tagToQuestions;

    event QuestionAsked(address indexed asker, uint256 indexed questionId, string content, string tag);
    event AnswerSubmitted(address indexed answerer, uint256 indexed questionId, uint256 answerId, string content);
    event BestAnswerSelected(address indexed asker, uint256 indexed questionId, uint256 answerId);
    event TagAdded(address indexed user, string tag, uint256 stake, uint256 timestamp);
    event TagRemoved(address indexed user, string tag, uint256 stake);
    event RewardClaimed(address indexed user, string tag, uint256 rewardAmount, uint256 timestamp);

    modifier tagExists(string memory _tag) {
        require(tags[_tag].userCount > 0, "Tag does not exist");
        _;
    }

    modifier onlyUserWithTag(string memory _tag) {
        require(userTags[msg.sender][_tag].exists, "User does not have this tag");
        _;
    }

    constructor(IERC20 _token) Ownable(msg.sender) {
        token = _token;
    }

     function registerUser(string memory _name) public {
        bytes memory nameBytes = bytes(_name);
        uint256 nameLength = nameBytes.length;

        // Check that the name is not empty
        require(nameLength > 0, "Name cannot be empty");

        // Check that the name length is within acceptable limits (e.g., 1 to 100 characters)
        require(nameLength <= 100, "Name is too long");

        // Check that the name contains only allowed characters (optional)
        for (uint256 i = 0; i < nameLength; i++) {
            bytes1 char = nameBytes[i];
            require(
                (char >= 0x41 && char <= 0x5A) || // Uppercase letters A-Z
                (char >= 0x61 && char <= 0x7A) || // Lowercase letters a-z
                (char == 0x20), // Space
                "Name contains invalid characters"
            );
        }

        // Check if the user is already registered
        require(bytes(users[msg.sender].name).length == 0, "User already registered");

        // Register the user with the new name
        users[msg.sender].name = _name;
    }

    function askQuestion(string memory _content, string memory _tag) public tagExists(_tag) onlyUserWithTag(_tag) {
        require(bytes(_content).length > 0, "Content cannot be empty");

        questions.push(Question({
            asker: msg.sender,
            content: _content,
            tag: _tag,
            answered: false,
            bestAnswerId: 0
        }));
        uint256 questionId = questions.length - 1;
        users[msg.sender].questions.push(questionId);
        tagToQuestions[_tag].push(questionId);

        require(token.transfer(msg.sender, REWARD_FOR_QUESTION), "Token transfer failed");

        emit QuestionAsked(msg.sender, questionId, _content, _tag);
    }

    function submitAnswer(uint256 _questionId, string memory _content) public {
        require(_questionId < questions.length, "Question does not exist");
        Question storage question = questions[_questionId];
        require(bytes(_content).length > 0, "Content cannot be empty");
        require(userTags[msg.sender][question.tag].exists, "User does not have the tag for this question");

        answers[_questionId].push(Answer({
            answerer: msg.sender,
            content: _content
        }));
        uint256 answerId = answers[_questionId].length - 1;

        require(token.transfer(msg.sender, REWARD_FOR_ANSWER), "Token transfer failed");

        emit AnswerSubmitted(msg.sender, _questionId, answerId, _content);
    }

    function selectBestAnswer(uint256 _questionId, uint256 _answerId) public {
        require(_questionId < questions.length, "Question does not exist");
        Question storage question = questions[_questionId];
        require(msg.sender == question.asker, "Only the asker can select the best answer");
        require(_answerId < answers[_questionId].length, "Answer does not exist");
        require(answers[_questionId][_answerId].answerer != msg.sender, "Cannot select your own answer as the best answer");

        question.bestAnswerId = _answerId;
        question.answered = true;

        address answerer = answers[_questionId][_answerId].answerer;
        require(token.transfer(answerer, BEST_ANSWER_REWARD), "Token transfer to best answerer failed");

        // Increment best answer count for the specific user's tag
        UserTag storage userTag = userTags[answerer][questions[_questionId].tag];
        userTag.bestAnswerCount += 1;

        emit BestAnswerSelected(msg.sender, _questionId, _answerId);
    }

    function addTag(string memory _tag) public payable {
        require(bytes(_tag).length > 0 && bytes(_tag).length <= MAX_TAG_LENGTH, "Tag must be between 1 and 10 characters");
        require(isUppercase(_tag), "Tag must be uppercase");
        require(msg.value >= TAG_STAKE_AMOUNT, "Insufficient stake for tag");
        require(!userTags[msg.sender][_tag].exists, "User already has this tag");

        if (tags[_tag].userCount == 0) {
            tags[_tag] = Tag({userCount: 1});
        } else {
            tags[_tag].userCount += 1;
        }

        userTags[msg.sender][_tag] = UserTag({
            exists: true,
            timestamp: block.timestamp,
            lastClaimed: block.timestamp,
            bestAnswerCount: 0 // Initialize bestAnswerCount
        });

        stakes[msg.sender] += msg.value;

        emit TagAdded(msg.sender, _tag, msg.value, block.timestamp);
    }

    function removeTag(string memory _tag) public nonReentrant onlyUserWithTag(_tag) {
        tags[_tag].userCount -= 1;
        delete userTags[msg.sender][_tag];

        uint256 stake = TAG_STAKE_AMOUNT;
        stakes[msg.sender] -= stake;

        (bool success, ) = msg.sender.call{value: stake}("");
        require(success, "Stake refund failed");

        emit TagRemoved(msg.sender, _tag, stake);
    }

    function claimReward(string memory _tag) public nonReentrant onlyUserWithTag(_tag) {
        UserTag storage userTag = userTags[msg.sender][_tag];
        uint256 timeElapsed = block.timestamp - userTag.lastClaimed;
        require(timeElapsed < ONE_MONTH, "Claim period is one month");

        uint256 monthlyReward = calculateReward(userTag.timestamp, block.timestamp);
        uint256 monthsForReward = timeElapsed / ONE_MONTH;
        uint256 reward = monthlyReward * monthsForReward;
        userTag.lastClaimed += monthsForReward * ONE_MONTH;

        require(token.transfer(msg.sender, reward), "Token transfer failed");

        emit RewardClaimed(msg.sender, _tag, reward, block.timestamp);
    }

    function calculateReward(uint256 joinTime, uint256 currentTime) internal pure returns (uint256) {
        uint256 monthsElapsed = (currentTime - joinTime) / ONE_MONTH;
        uint256 reward = 0;

        if (monthsElapsed < 6) {
            reward = 100 * 10 ** 18;
        } else if (monthsElapsed < 12) {
            reward = 200 * 10 ** 18;
        } else {
            reward = 500 * 10 ** 18;
        }

        return reward;
    }

    function getQuestionsByTag(string memory _tag) public view returns (Question[] memory) {
        uint256[] storage questionIds = tagToQuestions[_tag];
        Question[] memory result = new Question[](questionIds.length);

        for (uint256 i = 0; i < questionIds.length; i++) {
            result[i] = questions[questionIds[i]];
        }

        return result;
    }

    function isUppercase(string memory str) internal pure returns (bool) {
        bytes memory b = bytes(str);
        for (uint256 i = 0; i < b.length; i++) {
            if (b[i] < 0x41 || b[i] > 0x5A) {
                return false;
            }
        }
        return true;
    }

    function getFirstTenQuestions() public view returns (Question[] memory) {
        uint256 count = questions.length < 10 ? questions.length : 10;
        Question[] memory result = new Question[](count);

        for (uint256 i = 0; i < count; i++) {
            result[i] = questions[i];
        }

        return result;
    }

    function getFirstHundredQuestions() public view returns (Question[] memory) {
        uint256 count = questions.length < 100 ? questions.length : 100;
        Question[] memory result = new Question[](count);

        for (uint256 i = 0; i < count; i++) {
            result[i] = questions[i];
        }

        return result;
    }
}
