// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MessagingService {
    // Structure to hold message data
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    // Mapping from recipient to array of messages
    mapping(address => Message[]) private messages;

    // Event to be emitted when a new message is sent
    event MessageSent(address indexed sender, address indexed recipient, string content, uint256 timestamp);

    // Function to send a message
    function sendMessage(address _recipient, string memory _content) public {
        // Create a new message
        Message memory newMessage = Message({
            sender: msg.sender,
            content: _content,
            timestamp: block.timestamp
        });

        // Store the message
        messages[_recipient].push(newMessage);

        // Emit the MessageSent event
        emit MessageSent(msg.sender, _recipient, _content, block.timestamp);
    }

    // Function to get messages sent to the caller
    function getMyMessages() public view returns (Message[] memory) {
        return messages[msg.sender];
    }

    // Function to get the number of messages sent to the caller
    function getMyMessageCount() public view returns (uint256) {
        return messages[msg.sender].length;
    }
}
