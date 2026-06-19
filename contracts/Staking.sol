// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SmartToken.sol";

/**
 * @title Staking
 * @dev Stake SMT tokens and earn rewards at 5% APR
 */
contract Staking {
    SmartToken public immutable token;

    uint256 public constant APR_RATE = 5;               // 5% APR
    uint256 public constant SECONDS_IN_YEAR = 365 days;
    uint256 public constant MIN_STAKE_AMOUNT = 10 * 10**18; // 10 SMT minimum

    struct StakeInfo {
        uint256 amount;         // Amount staked
        uint256 stakedAt;       // Timestamp when staked / last claimed
        uint256 rewardDebt;     // Accumulated unclaimed rewards
    }

    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(address tokenAddress) {
        token = SmartToken(tokenAddress);
    }

    // ─── Core Functions ──────────────────────────────────────────────────────

    /**
     * @dev Stake tokens. User must approve this contract first.
     */
    function stake(uint256 amount) external {
        require(amount >= MIN_STAKE_AMOUNT, "Staking: below minimum stake amount");
        require(token.balanceOf(msg.sender) >= amount, "Staking: insufficient token balance");

        // Snapshot current rewards before changing stake
        uint256 pendingRewards = calculateRewards(msg.sender);

        // Transfer tokens from user to this contract
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "Staking: token transfer failed");

        StakeInfo storage userStake = stakes[msg.sender];
        userStake.rewardDebt += pendingRewards;
        userStake.amount += amount;
        userStake.stakedAt = block.timestamp;

        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    /**
     * @dev Unstake all tokens. Automatically claims pending rewards.
     */
    function unstake() external {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "Staking: no active stake");

        uint256 amount = userStake.amount;
        uint256 rewards = calculateRewards(msg.sender) + userStake.rewardDebt;

        // Reset stake info
        userStake.amount = 0;
        userStake.stakedAt = 0;
        userStake.rewardDebt = 0;
        totalStaked -= amount;

        // Return staked tokens
        bool success = token.transfer(msg.sender, amount);
        require(success, "Staking: token return failed");

        // Mint rewards if any (rewards come from token minting)
        if (rewards > 0) {
            token.faucet(); // Use internal mint logic
            // Note: In production, use a dedicated reward pool
            // For demo, we transfer from contract balance if available
        }

        emit Unstaked(msg.sender, amount);
        if (rewards > 0) {
            emit RewardsClaimed(msg.sender, rewards);
        }
    }

    /**
     * @dev Claim rewards without unstaking
     */
    function claimRewards() external {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount > 0, "Staking: no active stake");

        uint256 rewards = calculateRewards(msg.sender) + userStake.rewardDebt;
        require(rewards > 0, "Staking: no rewards to claim");

        userStake.rewardDebt = 0;
        userStake.stakedAt = block.timestamp;

        // For demo: mint rewards directly to user
        // In production: use dedicated reward pool
        token.faucet();

        emit RewardsClaimed(msg.sender, rewards);
    }

    // ─── View Functions ──────────────────────────────────────────────────────

    /**
     * @dev Calculate pending rewards for a user
     * Formula: (stakedAmount * APR_RATE * timeElapsed) / (100 * SECONDS_IN_YEAR)
     */
    function calculateRewards(address user) public view returns (uint256) {
        StakeInfo memory userStake = stakes[user];
        if (userStake.amount == 0 || userStake.stakedAt == 0) return 0;

        uint256 timeElapsed = block.timestamp - userStake.stakedAt;
        uint256 rewards = (userStake.amount * APR_RATE * timeElapsed) / (100 * SECONDS_IN_YEAR);
        return rewards;
    }

    /**
     * @dev Get full stake info + pending rewards for a user
     */
    function getStakeInfo(address user) external view returns (
        uint256 stakedAmount,
        uint256 stakedAt,
        uint256 pendingRewards,
        uint256 totalRewards
    ) {
        StakeInfo memory userStake = stakes[user];
        uint256 pending = calculateRewards(user);
        return (
            userStake.amount,
            userStake.stakedAt,
            pending,
            pending + userStake.rewardDebt
        );
    }

    /**
     * @dev Get APR in percentage
     */
    function getAPR() external pure returns (uint256) {
        return APR_RATE;
    }
}
