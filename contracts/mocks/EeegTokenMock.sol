// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./../EeggToken.sol";

/**
 * @dev EeegToken mock exposes `private` and `internal` functions publicly to allow testing.
 */
contract EeggTokenMock is EeggToken {
    function approveInternal(address _owner, address _spender, uint256 _amount) public {
        _approve(_owner, _spender, _amount);
    }

    function mintInternal(address _account, uint256 _amount) public {
        _mint(_account, _amount);
    }

    function burnInternal(address _account, uint256 _amount) public {
        _burn(_account, _amount);
    }
}
