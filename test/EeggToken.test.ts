import { expect } from 'chai'
import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { MAX_UINT256, ZERO_ADDRESS } from './constants'

describe('EeggToken', function() {
    async function deployTokenFixture() {
        const tokenFactory = await ethers.getContractFactory('EeggTokenMock')
        const [owner, addr1, addr2] = await ethers.getSigners()

        const hardhatToken = await tokenFactory.deploy()
        await hardhatToken.deployed()

        return { tokenFactory, hardhatToken, owner, addr1, addr2 }
    }

    describe('Deployment', function() {
        it('has proper name', async function() {
            const { hardhatToken } = await loadFixture(deployTokenFixture)

            expect(await hardhatToken.name()).to.equal('Eegg Token')
        })

        it('has proper symbol', async function() {
            const { hardhatToken } = await loadFixture(deployTokenFixture)

            expect(await hardhatToken.symbol()).to.equal('EEGG')
        })

        it('has 18 decimals', async function () {
            const { hardhatToken } = await loadFixture(deployTokenFixture)

            expect(await hardhatToken.decimals()).to.equal(18)
        })

        it('assigns totalSupply to the owner', async function() {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

            const ownerBalance = await hardhatToken.balanceOf(owner.address)
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance)
        })
    })

    describe('Mint', function() {
        it('rejects null _account', async function() {
            const { hardhatToken } = await loadFixture(deployTokenFixture)

            await expect(hardhatToken.mintInternal(ZERO_ADDRESS, 1)).to.be.reverted;
        })

        it('increments totalSupply', async function() {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

            var expectedTotalSupply = (await hardhatToken.totalSupply()).add(ethers.BigNumber.from(42))
            await hardhatToken.mintInternal(owner.address, 42)
            expect(await hardhatToken.totalSupply()).to.equal(expectedTotalSupply)
        })

        it('increments owner balance', async function() {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

            const expectedBalance = (await hardhatToken.balanceOf(owner.address)).add(ethers.BigNumber.from(42))
            await hardhatToken.mintInternal(owner.address, 42)
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(expectedBalance)
        })

        describe('Events', function() {
            it('emits Transfer event', async function() {
                const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

                await expect(hardhatToken.mintInternal(owner.address, 42))
                    .to.emit(hardhatToken, 'Transfer')
                    .withArgs(ZERO_ADDRESS, owner.address, 42)
            })
        })
    })

    describe('Burn', function() {
        it('rejects null _account', async function() {
            const { hardhatToken } = await loadFixture(deployTokenFixture)

            await expect(hardhatToken.burnInternal(ZERO_ADDRESS, 1)).to.be.reverted;
        })

        it('rejects insufficient balance', async function() {
            const { hardhatToken, addr1 } = await loadFixture(deployTokenFixture)

            await hardhatToken.transfer(addr1.address, 42)

            await expect(hardhatToken.burnInternal(addr1.address, 43)).to.be.reverted
        })

        it('burn reduces balance and totalSupply', async function() {
            const { hardhatToken, addr1 } = await loadFixture(deployTokenFixture)

            const amountToBurn = 11

            await hardhatToken.transfer(addr1.address, amountToBurn * 2)

            const expectedBalance = (await hardhatToken.balanceOf(addr1.address)).sub(ethers.BigNumber.from(amountToBurn))
            const expectedTotalSupply = (await hardhatToken.totalSupply()).sub(ethers.BigNumber.from(amountToBurn))

            await hardhatToken.burnInternal(addr1.address, amountToBurn)

            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(expectedBalance)
            expect(await hardhatToken.totalSupply()).to.equal(expectedTotalSupply)
        })

        describe('Events', function() {
            it('emits Transfer event', async function() {
                const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

                await expect(hardhatToken.burnInternal(owner.address, 42))
                    .to.emit(hardhatToken, 'Transfer')
                    .withArgs(owner.address, ZERO_ADDRESS, 42)
            })
        })
    })

    describe('Transfer', function() {
        it('rejects null _to account', async function() {
            const { hardhatToken } = await loadFixture(deployTokenFixture)

            await expect(hardhatToken.transfer(ZERO_ADDRESS, 1)).to.be.reverted
        })

        it('can transfer zero token', async function() {
            const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture)

            const expectedOwnerBalance = await hardhatToken.balanceOf(owner.address)
            const expectedAddr1Balance = await hardhatToken.balanceOf(addr1.address)

            await hardhatToken.transfer(addr1.address, 0)

            expect(await hardhatToken.balanceOf(owner.address)).to.equal(expectedOwnerBalance)
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(expectedAddr1Balance)
        })

        it('updates balances right', async function() {
            const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture)

            const amount = ethers.BigNumber.from(42)
            const expectedOwnerBalance = (await hardhatToken.balanceOf(owner.address)).sub(amount)
            const expectedAddr1Balance = (await hardhatToken.balanceOf(addr1.address)).add(amount)

            await hardhatToken.transfer(addr1.address, 42)

            expect(await hardhatToken.balanceOf(owner.address)).to.equal(expectedOwnerBalance)
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(expectedAddr1Balance)
        })

        it('does not affect totalSupply', async function() {
            const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture)

            const expectedTotalSupply = await hardhatToken.totalSupply()
            await hardhatToken.transfer(addr1.address, 42)
            expect(await hardhatToken.totalSupply()).to.equal(expectedTotalSupply)
        })

        describe('Events', function() {
            it('emits Transfer event', async function() {
                const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture)

                await expect(hardhatToken.transfer(addr1.address, 42))
                    .to.emit(hardhatToken, 'Transfer')
                    .withArgs(owner.address, addr1.address, 42)
            })
        })
    })

    describe('Approve', function() {
        it('rejects null _spender address', async function() {
            const { hardhatToken } = await loadFixture(deployTokenFixture)

            await expect(hardhatToken.approve(ZERO_ADDRESS, 42)).to.be.reverted
        })

        it('reject null _owner address', async function() {
            const { hardhatToken, addr1 } = await loadFixture(deployTokenFixture)

            await expect(hardhatToken.approveInternal(ZERO_ADDRESS, addr1.address, 42)).to.be.reverted
        })

        it('approves with no previous approval', async function() {
            const { hardhatToken, addr1, addr2 } = await loadFixture(deployTokenFixture)

            await hardhatToken.approveInternal(addr1.address, addr2.address, 42)
            expect(await hardhatToken.allowance(addr1.address, addr2.address)).to.equal(42)
        })

        it('subsequent approval overwrites previous', async function() {
            const { hardhatToken, addr1, addr2 } = await loadFixture(deployTokenFixture)

            await hardhatToken.approveInternal(addr1.address, addr2.address, 42)
            expect(await hardhatToken.allowance(addr1.address, addr2.address)).to.equal(42)

            await hardhatToken.approveInternal(addr1.address, addr2.address, 21)
            expect(await hardhatToken.allowance(addr1.address, addr2.address)).to.equal(21)
        })

        describe('Events', function() {
            it('emits Approval event', async function() {
                const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture)

                await expect(hardhatToken.approve(addr1.address, 42))
                    .to.emit(hardhatToken, 'Approval')
                    .withArgs(owner.address, addr1.address, 42)
            })
        })
    })

    describe('TransferFrom', function() {
        it('rejects null _sender address', async function() {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture)

            await hardhatToken.transfer(addr1.address, 42)
            await hardhatToken.connect(addr1).approve(addr2.address, 21)

            await expect(hardhatToken.transferFrom(ZERO_ADDRESS, owner.address, 1)).to.be.reverted
        })

        it('rejects null _recipient address', async function() {
            const { hardhatToken, addr1, addr2 } = await loadFixture(deployTokenFixture)

            await hardhatToken.transfer(addr1.address, 42)
            await hardhatToken.connect(addr1).approve(addr2.address, 21)

            await expect(hardhatToken.transferFrom(addr2.address, ZERO_ADDRESS, 1)).to.be.reverted
        })

        it('rejects insufficient allowance', async function() {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture)

            await hardhatToken.transfer(addr1.address, 42)
            await hardhatToken.connect(addr1).approve(addr2.address, 21)

            await expect(hardhatToken.connect(addr2).transferFrom(addr2.address, owner.address, 42)).to.be.reverted
        })

        it('transfers when allowed and updates the remaining allowance', async function() {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture)

            await hardhatToken.transfer(addr1.address, 42)
            await hardhatToken.connect(addr1).approve(addr2.address, 21)

            expect(await hardhatToken.allowance(addr1.address, addr2.address)).to.equal(ethers.BigNumber.from(21))

            const amount = 11
            const expectedOwnerBalance = (await hardhatToken.balanceOf(owner.address)).add(ethers.BigNumber.from(amount))
            const expectedSenderBalance = (await hardhatToken.balanceOf(addr1.address)).sub(ethers.BigNumber.from(amount))

            await hardhatToken.connect(addr2).transferFrom(addr1.address, owner.address, amount)

            expect(await hardhatToken.balanceOf(owner.address)).to.equal(expectedOwnerBalance)
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(expectedSenderBalance)
            expect(await hardhatToken.allowance(addr1.address, addr2.address)).to.equal(ethers.BigNumber.from(21-amount))
        })

        it('transfers when allowed and does not update the remaining allowance when allows equals max', async function() {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture)

            await hardhatToken.transfer(addr1.address, 42)
            await hardhatToken.connect(addr1).approve(addr2.address, MAX_UINT256)

            expect(await hardhatToken.allowance(addr1.address, addr2.address)).to.equal(MAX_UINT256)

            const amount = 11
            const expectedOwnerBalance = (await hardhatToken.balanceOf(owner.address)).add(ethers.BigNumber.from(amount))
            const expectedSenderBalance = (await hardhatToken.balanceOf(addr1.address)).sub(ethers.BigNumber.from(amount))

            await hardhatToken.connect(addr2).transferFrom(addr1.address, owner.address, amount)

            expect(await hardhatToken.balanceOf(owner.address)).to.equal(expectedOwnerBalance)
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(expectedSenderBalance)
            expect(await hardhatToken.allowance(addr1.address, addr2.address)).to.equal(MAX_UINT256)
        })

        describe('Events', function() {
            it('emits Approval event', async function() {
                const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture)

                await hardhatToken.transfer(addr1.address, 42)
                await hardhatToken.connect(addr1).approve(addr2.address, 21)

                await expect(hardhatToken.connect(addr2).transferFrom(addr1.address, owner.address, 11))
                    .to.emit(hardhatToken, 'Approval')
                    .withArgs(addr1.address, addr2.address, 10)
            })
        })
    })

    describe('AccessControl', function() {
        it('grants ROLE_ADMIN to the owner', async function() {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

            expect(await hardhatToken.hasRole(hardhatToken.ROLE_ADMIN(), owner.address)).to.equal(true);
        })

        it('rejects non admin account to {mint}', async function() {
            const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture)

            await expect(hardhatToken.connect(addr1).mint(owner.address, 42)).to.be.reverted;
        })

        it('rejects non admin account to {burn}', async function() {
            const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture)

            await expect(hardhatToken.connect(addr1).burn(owner.address, 42)).to.be.reverted;
        })

        it('mints for admin', async function() {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

            const amount = 42
            const expectedBalance = (await hardhatToken.balanceOf(owner.address)).add(ethers.BigNumber.from(amount))
            await expect(hardhatToken.mint(owner.address, 42)).not.be.reverted;
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(expectedBalance)
        })

        it('burns for admin', async function() {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture)

            const amount = 42
            const expectedBalance = (await hardhatToken.balanceOf(owner.address)).sub(ethers.BigNumber.from(amount))
            await expect(hardhatToken.burn(owner.address, 42)).not.be.reverted;
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(expectedBalance)
        })
    })
})
