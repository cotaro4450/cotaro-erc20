const { expect } = require('chai');

describe('Token contract', function () {
  let [owner, accountA, accountB] = [];
  let token;
  const amount = 100;
  const totalSupply = '21000000000000000000000000';

  beforeEach(async () => {
    [owner, accountA, accountB] = await ethers.getSigners();
    const Token = await ethers.getContractFactory('Token');
    token = await Token.deploy();
    await token.deployed();
  });

  describe('common', function () {
    it('total supply should return righr value', async function () {
      expect((await token.totalSupply()).toString()).to.be.equal(totalSupply);
    });
    it('balance of owner should return righr value', async function () {
      expect((await token.balanceOf(owner.address)).toString()).to.be.equal(totalSupply);
    });
    it('balance of account A should return righr value', async function () {
      expect(await token.balanceOf(accountA.address)).to.be.equal(0);
    });
    it('allowance of account owner to account A should return righr value', async function () {
      expect(await token.allowance(owner.address, accountA.address)).to.be.equal(0);
    });
  })

  describe('transferFrom', function () {
    it('transferFrom should revert if amount exceeds balance', async function () {
      await expect(
        token
          .connect(accountA)
          .transferFrom(accountA.address, accountB.address, amount)
      ).to.be.reverted;
    });
    it('transferFrom should revert if amount exceeds allowance balance', async function () {
      await expect(
        token
          .connect(accountA)
          .transferFrom(owner.address, accountA.address, amount)
      ).to.be.reverted;
    });
    it('transferFrom should work correctly', async function () {
      await token.approve(accountA.address, amount);
      const transferFromTx = await token
        .connect(accountA)
        .transferFrom(owner.address, accountB.address, amount);
      expect(await token.balanceOf(accountB.address)).to.be.equal(amount);
      await expect(transferFromTx)
        .to.emit(token, 'Transfer')
        .withArgs(owner.address, accountB.address, amount);
    });
  });

  describe('approve', function () {
    it('approve should work correctly', async function () {
      const approveTx = await token.approve(accountA.address, amount);
      expect(await token.allowance(owner.address, accountA.address)).to.be.equal(amount);
      await expect(approveTx)
        .to.emit(token, 'Approval')
        .withArgs(owner.address, accountA.address, amount);
    });
  });
});