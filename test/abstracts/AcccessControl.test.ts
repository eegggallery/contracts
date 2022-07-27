import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'

describe('abstracts.AccessControl', function() {
    async function deployContractFixture() {
        const contractFactory = await ethers.getContractFactory('AccessControlMock')
        const [owner, addr1, addr2] = await ethers.getSigners()

        const hardhatContract = await contractFactory.deploy()
        await hardhatContract.deployed()

        return { contractFactory, hardhatContract, owner, addr1, addr2 }
    }

    describe('Admin access', function() {
        it('revokes non admin account to {grantRole}', async function() {
            const { hardhatContract, owner, addr1, addr2 } = await loadFixture(deployContractFixture)

            await expect(hardhatContract.connect(addr1).grantRole(hardhatContract.ROLE_ADMIN(), addr2.address)).to.be.reverted;
        })

        it('revokes non admin accounts to {revokeRole}', async function() {
            const { hardhatContract, owner, addr1, addr2 } = await loadFixture(deployContractFixture)

            await expect(hardhatContract.connect(addr1).revokeRole(hardhatContract.ROLE_ADMIN(), addr2.address)).to.be.reverted;
        })
    })

    describe('Grant', function() {
        it('grants non-granted role', async function() {
            const { hardhatContract, owner, addr1, addr2 } = await loadFixture(deployContractFixture)

            hardhatContract.grantRole(await hardhatContract.ROLE_FOO(), addr1.address)
            expect(await hardhatContract.connect(addr2).hasRole(hardhatContract.ROLE_FOO(), addr1.address)).to.equal(true)
            expect(await hardhatContract.connect(addr2).hasRole(hardhatContract.ROLE_ADMIN(), addr1.address)).to.equal(false)
        })

        it('grants already granted role', async function() {
            const { hardhatContract, owner, addr1, addr2 } = await loadFixture(deployContractFixture)

            hardhatContract.grantRole(await hardhatContract.ROLE_FOO(), addr1.address)
            expect(await hardhatContract.connect(addr2).hasRole(hardhatContract.ROLE_FOO(), addr1.address)).to.equal(true)
            hardhatContract.grantRole(await hardhatContract.ROLE_FOO(), addr1.address)
            expect(await hardhatContract.connect(addr2).hasRole(hardhatContract.ROLE_FOO(), addr1.address)).to.equal(true)
        })
    })

    describe('Revoke', async function() {
        it('revokes granted role', async function() {
            const { hardhatContract, owner, addr1, addr2 } = await loadFixture(deployContractFixture)

            hardhatContract.grantRole(hardhatContract.ROLE_FOO(), addr1.address)
            expect(await hardhatContract.connect(addr2).hasRole(await hardhatContract.ROLE_FOO(), addr1.address)).to.equal(true)

            hardhatContract.revokeRole(hardhatContract.ROLE_FOO(), addr1.address)
            expect(await hardhatContract.connect(addr2).hasRole(await hardhatContract.ROLE_FOO(), addr1.address)).to.equal(false)
        })

        it('revokes non-granted role', async function() {
            const { hardhatContract, owner, addr1, addr2 } = await loadFixture(deployContractFixture)

            hardhatContract.revokeRole(await hardhatContract.ROLE_FOO(), addr1.address)
            expect(await hardhatContract.connect(addr2).hasRole(hardhatContract.ROLE_FOO(), addr1.address)).to.equal(false)
        })

        it('rejects revoking last ROLE_ADMIN', async function() {
            const { hardhatContract, owner } = await loadFixture(deployContractFixture)

            await expect(hardhatContract.revokeRole(await hardhatContract.ROLE_ADMIN(), owner.address)).to.be.rejected
        })

        it('revokes ROLE_ADMIN when there remains another granted', async function() {
            const { hardhatContract, owner, addr1 } = await loadFixture(deployContractFixture)

            await hardhatContract.grantRole(await hardhatContract.ROLE_ADMIN(), addr1.address)
            await expect(hardhatContract.revokeRole(await hardhatContract.ROLE_ADMIN(), owner.address)).not.be.rejected

            await expect(hardhatContract.revokeRole(await hardhatContract.ROLE_ADMIN(), owner.address)).to.be.rejected
            await expect(hardhatContract.revokeRole(await hardhatContract.ROLE_ADMIN(), addr1.address)).to.be.rejected
        })
    })

    describe('Events', function() {
        it('emits RoleGranted', async function() {
            const { hardhatContract, owner, addr1 } = await loadFixture(deployContractFixture)

            await expect(hardhatContract.grantRole(await hardhatContract.ROLE_FOO(), addr1.address))
                .to.emit(hardhatContract, 'RoleGranted')
                .withArgs(await hardhatContract.ROLE_FOO(), addr1.address, owner.address)
        })

        it('does not emit RoleGranted on already granted role', async function() {
            const { hardhatContract, owner, addr1 } = await loadFixture(deployContractFixture)

            hardhatContract.grantRole(await hardhatContract.ROLE_FOO(), addr1.address)
            await expect(hardhatContract.grantRole(await hardhatContract.ROLE_FOO(), addr1.address))
                .not.emit(hardhatContract, 'RoleGranted')
        })

        it('emits RoleRevoked', async function() {
            const { hardhatContract, owner, addr1 } = await loadFixture(deployContractFixture)

            hardhatContract.grantRole(await hardhatContract.ROLE_FOO(), addr1.address)
            await expect(hardhatContract.revokeRole(await hardhatContract.ROLE_FOO(), addr1.address))
                .to.emit(hardhatContract, 'RoleRevoked')
                .withArgs(await hardhatContract.ROLE_FOO(), addr1.address, owner.address)
        })

        it('does not emit RoleRevoked on not granted role', async function() {
            const { hardhatContract, owner, addr1 } = await loadFixture(deployContractFixture)

            await expect(hardhatContract.grantRole(await hardhatContract.ROLE_FOO(), addr1.address))
                .not.emit(hardhatContract, 'RoleRevoked')
        })
    })
})
