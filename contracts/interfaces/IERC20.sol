// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 * https://ethereum.org/en/developers/tutorials/understand-the-erc-20-token-smart-contract/
 */
interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);
    function balanceOf(address _account) external view returns (uint256);
    function allowance(address _owner, address _spender) external view returns (uint256);
    function approve(address _spender, uint256 _amount) external returns (bool);

    function transfer(address _recipient, uint256 _amount) external returns (bool);
    function transferFrom(address _owner, address _recipient, uint256 _amount) external returns (bool);
}
