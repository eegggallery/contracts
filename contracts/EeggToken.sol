// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC20.sol";
import "./abstracts/AccessControl.sol";

/**
 * @title Eegg Gallery Token contract
 *
 * @dev Implementation of the {IERC20} interface.
 *
 * This implementation is agnostic to the way tokens are created. This means
 * that a supply mechanism has to be added in a derived contract using {_mint}.
 *
 * We have followed Contracts' conventional behaviour: functions revert instead
 * returning `false` on failure. This behavior does not conflict with the
 * expectations of ERC20 applications.
 */
contract EeggToken is IERC20, AccessControl {
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    uint256 public override totalSupply;

    string public constant name = "Eegg Token";
    string public constant symbol = "EEGG";
    uint8 public constant decimals = 18;

    /**
     * @dev Modifier that alloes only accounts with ROLE_ADMIN granted.
     * Reverts with a standardized message including the required role.
     */
    modifier onlyAdmin() {
        _checkRole(ROLE_ADMIN);
        _;
    }

    constructor() {
        _grantRole(ROLE_ADMIN, msg.sender);
        _mint(msg.sender, 1_000_000 * 10 ** decimals);
    }

    function balanceOf(address _account) public view override returns (uint256) {
        return balances[_account];
    }

    function allowance(address _owner, address _spender) public view override returns (uint256) {
        return allowances[_owner][_spender];
    }

    function approve(address _spender, uint256 _amount) public override returns (bool) {
        address owner = msg.sender;
        _approve(owner, _spender, _amount);
        return true;
    }

    function transfer(address _recipient, uint256 _amount) public override returns (bool) {
        _transfer(msg.sender, _recipient, _amount);
        return true;
    }

    function transferFrom(address _owner, address _recipient, uint256 _amount) public override returns (bool) {
        _spendAllowance(_owner, msg.sender, _amount);
        _transfer(_owner, _recipient, _amount);
        return true;
    }

    /**
     * Mints given `_amount` of tokens to the given `_account` address.
     * @notice The method is allowed only to address with ROLE_ADMIN granted.
     */
    function mint(address _account, uint256 _amount) public onlyAdmin() {
        _mint(_account, _amount);
    }

    /**
     * Burns given `_amount` of tokens from the given `_account` address.
     * @notice The method is allowed only to address with ROLE_ADMIN granted.
     */
    function burn(address _address, uint256 _amount) public onlyAdmin() {
        _burn(_address, _amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     * - `_owner` cannot be the zero address.
     * - `_spender` cannot be the zero address.
     */
    function _approve(address _owner, address _spender, uint256 _amount) internal {
        require(_owner != address(0), "approve from the zero address");
        require(_spender != address(0), "approve to the zero address");

        allowances[_owner][_spender] = _amount;
        emit Approval(_owner, _spender, _amount);
    }

    /**
     * @dev Creates `_amount` tokens and assigns them to `_account`.
     * Increases the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     * - `_account` cannot be the zero address.
     */
    function _mint(address _account, uint256 _amount) internal {
        require(_account != address(0), "mint to the zero address");

        totalSupply += _amount;
        unchecked {
            balances[_account] += _amount;
        }

        emit Transfer(address(0), _account, _amount);
    }

    /**
     * @dev Destroys `_amount` tokens from `_account`.
     * Reduces the total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     * - `_account` cannot be the zero address.
     * - `_account` must have at least `_amount` tokens.
     */
    function _burn(address _account, uint256 _amount) internal {
        require(_account != address(0), "burn from the zero address");
        require(balances[_account] >= _amount, "burn amount exceeds balance");

        unchecked {
            balances[_account] -= _amount;
            totalSupply -= _amount;
        }

        emit Transfer(_account, address(0), _amount);
    }

    /**
     * @dev Moves `amount` of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `_sender` cannot be the zero address.
     * - `_sender` must have a balance of at least `amount`.
     * - `_recipient` cannot be the zero address.
     */
    function _transfer(address _sender, address _recipient, uint256 _amount) internal {
        require(_sender != address(0), "transfer from the zero address");
        require(_recipient != address(0), "transfer to the zero address");

        uint256 fromBalance = balances[_sender];
        require(fromBalance >= _amount, "transfer amount exceeds balance");
        unchecked {
            balances[_sender] = fromBalance - _amount;
            balances[_recipient] += _amount;
        }

        emit Transfer(_sender, _recipient, _amount);
    }

    /**
     * @dev Updates `_owner`'s allowance for `_spender` based on requested `_amount`.
     *
     * Does not update the allowance amount in case of infinite allowance (type(uint256).max).
     * Reverts if not enough allowance is available.
     *
     * Might emit an {Approval} event.
     */
    function _spendAllowance(address _owner, address _spender, uint256 _amount) internal {
        uint256 allowed = allowance(_owner, _spender);
        if (allowed == type(uint256).max) {
            return;
        }

        require(allowed >= _amount, "insufficient allowance");
        unchecked {
            _approve(_owner, _spender, allowed - _amount);
        }
    }
}
