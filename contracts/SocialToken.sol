// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract SocialToken is ERC20, Ownable, ERC20Permit {
     constructor(string memory name, string memory symbol)
        ERC20(name, symbol)
        Ownable(msg.sender)
        ERC20Permit(name)
        {
        _mint(address(this), 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        super.transferOwnership(newOwner);
    }
}
