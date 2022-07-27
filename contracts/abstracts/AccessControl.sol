// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @dev Contract module that allows to implement role-based access control mechanisms.
 *
 * Roles are referred to by their `bytes32` identifier. These should be exposed
 * in the external API and be unique by using `public constant` hash digests:
 *
 * ```
 * bytes32 public constant ROLE_FOO = keccak256("ROLE_FOO");
 * ```
 *
 * Roles restrict access to a function call by using {hasRole}:
 *
 * ```
 * function foo() public {
 *     require(hasRole(ROLE_FOO, msg.sender));
 *     ...
 * }
 * ```
 *
 * By default, the admin role is `ROLE_ADMIN`, which means that only accounts with this
 * role will be able to grant or revoke other roles. Roles can be granted and revoked
 * dynamically via the {grantRole} and {revokeRole}.
 *
 * Usage:
 *
 * There must be at least one address with ROLE_ADMIN granted. Otherwise no one can use it.
 * Typically, the owner (deployer) of a contract should be granted with ROLE_ADMIN.
 * To achieve it, grant the ROLE_ADMIN to `msg.sender` in the {constructor}.
 *
 * ```
 * constructor() {
 *     _grantRole(ROLE_ADMIN, msg.sender);
 * }
 * ```
 */
abstract contract AccessControl {
    mapping(bytes32 => mapping(address => bool)) private roles;
    uint256 private roleAdminTotalGrants = 0;

    bytes32 public constant ROLE_ADMIN = 0x00;

    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Reports whether given `_account` has been granted to given `_role`.
     */
    function hasRole(bytes32 _role, address _account) public view virtual returns (bool) {
        return roles[_role][_account];
    }

    /**
     * @dev Modifier that checks that the `msg.sender` has a specific `_role`.
     * Reverts with a standardized message including the required role.
     */
    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    function grantRole(bytes32 _role, address _account) public virtual onlyRole(ROLE_ADMIN) {
        _grantRole(_role, _account);
    }

    function revokeRole(bytes32 _role, address _account) public virtual onlyRole(ROLE_ADMIN) {
        _revokeRole(_role, _account);
    }

    function _checkRole(bytes32 _role) internal view virtual {
        _checkRole(_role, msg.sender);
    }

    /**
     * @dev Grants given `_role` to given _`account`.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleGranted} event.
     */
    function _grantRole(bytes32 _role, address _account) internal virtual {
        if (hasRole(_role, _account)) {
            return;
        }

        if (_role == ROLE_ADMIN) {
            roleAdminTotalGrants++;
        }
        roles[_role][_account] = true;
        emit RoleGranted(_role, _account, msg.sender);
    }

    /**
     * @dev Revokes given `_role` from given `_account`.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleRevoked} event.
     */
    function _revokeRole(bytes32 _role, address _account) internal virtual {
        if (!hasRole(_role, _account)) {
            return;
        }

        if (_role == ROLE_ADMIN) {
            _checkRoleAdminCanBeRevoked();
            roleAdminTotalGrants--;
        }
        roles[_role][_account] = false;
        emit RoleRevoked(_role, _account, msg.sender);
    }

    function _checkRole(bytes32 _role, address _account) internal view virtual {
        if (!hasRole(_role, _account)) {
            revert(
                string(
                    abi.encodePacked(
                        "AccessControll: account: ",
                        Strings.toHexString(_account),
                        " has not been granted with role ",
                        Strings.toHexString(uint256(_role), 32)
                    )
                )
            );
        }
    }

    function _checkRoleAdminCanBeRevoked() internal view virtual {
        if (roleAdminTotalGrants <= 1) {
            revert(string("At least one ROLE_ADMIN must remain to operate the Contract"));
        }
    }
}
