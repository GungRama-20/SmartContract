// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title UserManagement
 * @dev Manages user profiles on-chain with full CRUD operations, events, and reentrancy protection.
 */
contract UserManagement is Ownable, ReentrancyGuard {
    struct UserData {
        uint256 id;
        string name;
        string email;
        uint256 createdAt;
    }

    // Mapping from user address to UserData
    mapping(address => UserData) private users;
    // Track registered status
    mapping(address => bool) private registered;
    // Array of all user addresses
    address[] private userAddresses;
    // Mapping from address to index in userAddresses array
    mapping(address => uint256) private addressIndices;

    uint256 private nextUserId = 1;

    // Events
    event UserCreated(address indexed userAddress, uint256 id, string name, string email, uint256 createdAt);
    event UserUpdated(address indexed userAddress, string name, string email);
    event UserDeleted(address indexed userAddress, uint256 id);

    // Modifiers
    modifier onlyRegistered() {
        require(registered[msg.sender], "User Management: Sender is not registered");
        _;
    }

    modifier notRegistered() {
        require(!registered[msg.sender], "User Management: Sender is already registered");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Register a new user profile.
     * @param _name Name of the user.
     * @param _email Email of the user.
     */
    function createUser(string calldata _name, string calldata _email) external notRegistered nonReentrant {
        require(bytes(_name).length > 0, "User Management: Name cannot be empty");
        require(bytes(_email).length > 0, "User Management: Email cannot be empty");

        uint256 userId = nextUserId++;
        users[msg.sender] = UserData({
            id: userId,
            name: _name,
            email: _email,
            createdAt: block.timestamp
        });

        addressIndices[msg.sender] = userAddresses.length;
        userAddresses.push(msg.sender);
        registered[msg.sender] = true;

        emit UserCreated(msg.sender, userId, _name, _email, block.timestamp);
    }

    /**
     * @notice Fetch user profile details.
     * @param _userAddress Address of the user to fetch.
     */
    function getUser(address _userAddress) external view returns (UserData memory) {
        require(registered[_userAddress], "User Management: User does not exist");
        return users[_userAddress];
    }

    /**
     * @notice Get all registered users on the platform.
     */
    function getAllUsers() external view returns (UserData[] memory) {
        uint256 total = userAddresses.length;
        UserData[] memory list = new UserData[](total);
        for (uint256 i = 0; i < total; i++) {
            list[i] = users[userAddresses[i]];
        }
        return list;
    }

    /**
     * @notice Update caller's profile.
     * @param _name New name of the user.
     * @param _email New email of the user.
     */
    function updateUser(string calldata _name, string calldata _email) external onlyRegistered nonReentrant {
        require(bytes(_name).length > 0, "User Management: Name cannot be empty");
        require(bytes(_email).length > 0, "User Management: Email cannot be empty");

        UserData storage user = users[msg.sender];
        user.name = _name;
        user.email = _email;

        emit UserUpdated(msg.sender, _name, _email);
    }

    /**
     * @notice Delete caller's profile.
     */
    function deleteUser() external onlyRegistered nonReentrant {
        uint256 userId = users[msg.sender].id;
        
        // Clear mapping data
        delete users[msg.sender];
        registered[msg.sender] = false;

        // Remove from address list by swapping with last element and popping
        uint256 index = addressIndices[msg.sender];
        uint256 lastIndex = userAddresses.length - 1;

        if (index < lastIndex) {
            address lastAddress = userAddresses[lastIndex];
            userAddresses[index] = lastAddress;
            addressIndices[lastAddress] = index;
        }

        userAddresses.pop();
        delete addressIndices[msg.sender];

        emit UserDeleted(msg.sender, userId);
    }

    /**
     * @notice Admin only deletion of user profile.
     * @param _userAddress Address of user profile to delete.
     */
    function adminDeleteUser(address _userAddress) external onlyOwner {
        require(registered[_userAddress], "User Management: User does not exist");
        uint256 userId = users[_userAddress].id;

        delete users[_userAddress];
        registered[_userAddress] = false;

        uint256 index = addressIndices[_userAddress];
        uint256 lastIndex = userAddresses.length - 1;

        if (index < lastIndex) {
            address lastAddress = userAddresses[lastIndex];
            userAddresses[index] = lastAddress;
            addressIndices[lastAddress] = index;
        }

        userAddresses.pop();
        delete addressIndices[_userAddress];

        emit UserDeleted(_userAddress, userId);
    }

    /**
     * @notice Verify if a user is registered.
     */
    function isUserRegistered(address _userAddress) external view returns (bool) {
        return registered[_userAddress];
    }
}
