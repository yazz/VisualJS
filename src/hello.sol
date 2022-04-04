pragma solidity ^0.4.21;
contract Hello {
    string public message;
    function Hello(string initialMessage) public {
        message = initialMessage;
    }
    function setMessage(string newMessage) public {
        message = newMessage;
    }
}
