import { expect } from 'chai';
import {ethers} from 'hardhat';
import { OverflowTest } from '../typechain-types/contracts/OverflowTest';

const SAFE_INCREMENT = 99;
const UNSAFE_INCREMENT = 199;

if (SAFE_INCREMENT + UNSAFE_INCREMENT <= 2 ** 8)
  throw new Error("Test not properly configured");

describe("Testing Overflow operations", async () => {
  let testContract: OverflowTest;

  beforeEach(async () => {
    const testContractFactory = await ethers.getContractFactory("OverflowTest");
    testContract = await testContractFactory.deploy();
    await testContract.deployed();
    const tx = await testContract.increment(SAFE_INCREMENT);
    await tx.wait();
  });

  describe("When incrementing under safe circumstances", async () => {
    it("increments correctly", async () => {
      // TODO
      const counter = await testContract.counter();
      expect(counter).to.eq(SAFE_INCREMENT);
    });
  });
  describe("When incrementing to overflow", async () => {
    it("reverts", async () => {
      // TODO
    });
  });
  describe("When incrementing to overflow within a unchecked block", async () => {
    it("overflows and increments", async () => {
      // TODO
      const tx = await testContract.forceIncrement(UNSAFE_INCREMENT)
    });
  });
});