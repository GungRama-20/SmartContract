// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SmartToken (SMT)
 * @dev ERC-20 Token with faucet, mint, burn, and transfer capabilities
 */
contract SmartToken {
    string public name = "SmartToken";
    string public symbol = "SMT";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100 million SMT
    uint256 public constant FAUCET_AMOUNT = 1000 * 10**18;     // 1000 SMT per faucet
    uint256 public constant FAUCET_COOLDOWN = 24 hours;

    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => uint256) public lastFaucetTime;

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event FaucetClaimed(address indexed claimant, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "SmartToken: caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        // Mint initial supply to owner
        uint256 initialSupply = 10_000_000 * 10**18; // 10 million SMT
        _mint(owner, initialSupply);
    }

    // ─── ERC-20 Core ────────────────────────────────────────────────────────

    function transfer(address to, uint256 amount) external returns (bool) {
        require(to != address(0), "SmartToken: transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "SmartToken: insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        require(spender != address(0), "SmartToken: approve to zero address");
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(to != address(0), "SmartToken: transfer to zero address");
        require(balanceOf[from] >= amount, "SmartToken: insufficient balance");
        require(allowance[from][msg.sender] >= amount, "SmartToken: insufficient allowance");

        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;

        emit Transfer(from, to, amount);
        return true;
    }

    // ─── Mint & Burn ────────────────────────────────────────────────────────

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply + amount <= MAX_SUPPLY, "SmartToken: max supply exceeded");
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        require(balanceOf[msg.sender] >= amount, "SmartToken: insufficient balance");
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Burn(msg.sender, amount);
        emit Transfer(msg.sender, address(0), amount);
    }

    // ─── Faucet ─────────────────────────────────────────────────────────────

    /**
     * @dev Anyone can claim 1000 SMT once every 24 hours
     */
    function faucet() external {
        require(
            block.timestamp >= lastFaucetTime[msg.sender] + FAUCET_COOLDOWN,
            "SmartToken: faucet cooldown not expired"
        );
        require(totalSupply + FAUCET_AMOUNT <= MAX_SUPPLY, "SmartToken: max supply exceeded");

        lastFaucetTime[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);

        emit FaucetClaimed(msg.sender, FAUCET_AMOUNT);
    }

    /**
     * @dev Returns seconds remaining until next faucet claim (0 if ready)
     */
    function faucetCooldownRemaining(address user) external view returns (uint256) {
        if (block.timestamp >= lastFaucetTime[user] + FAUCET_COOLDOWN) {
            return 0;
        }
        return (lastFaucetTime[user] + FAUCET_COOLDOWN) - block.timestamp;
    }

    // ─── Internal ───────────────────────────────────────────────────────────

    function _mint(address to, uint256 amount) internal {
        require(to != address(0), "SmartToken: mint to zero address");
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }
}
