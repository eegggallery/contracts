// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./../abstracts/AccessControl.sol";

/**
 * @dev AccessControl mock exposes `private` and `internal` functions publicly to allow testing.
 */
contract AccessControlMock is AccessControl {
    bytes32 public constant ROLE_FOO = keccak256("ROLE_FOO");

    constructor() {
        _grantRole(ROLE_ADMIN, msg.sender);
    }

    function checkRoleInternal(bytes32 _role) public view {
        _checkRole(_role);
    }

    function checkRoleInternal(bytes32 _role, address _account) public view {
        _checkRole(_role, _account);
    }

    function grantRoleInternal(bytes32 _role, address _account) public {
        _grantRole(_role, _account);
    }

    function revokeRoleInternal(bytes32 _role, address _account) public {
        _revokeRole(_role, _account);
    }
}
