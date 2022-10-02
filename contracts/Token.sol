//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  uint constant _initial_supply = 21000000 * (10**18);

  constructor() ERC20("CotaroToken", "CTR") {
    _mint(msg.sender, _initial_supply);
  }
}