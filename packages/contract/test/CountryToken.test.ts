import { expect, use } from "chai";

import { Contract } from "ethers";
import { deployContract, MockProvider, solidity } from "ethereum-waffle";
import ContinentTokenContract from "../build/ContinentToken.json";
import { Address } from "cluster";

use(solidity);
interface Continent {
  name: string;
  owner: Address;
}
describe("Country Token", async () => {
  const [contractOwner, purchaser] = new MockProvider().getWallets();
  let ContinentToken: Contract;

  beforeEach(async () => {
    ContinentToken = await deployContract(
      contractOwner,
      ContinentTokenContract
    );
  });
  it("is deployed", async () => {
    expect(await ContinentToken.signer.getAddress()).to.equal(
      contractOwner.address
    );
  });
  it("can sell a continent", async () => {
    expect(
      await ContinentToken.connect(purchaser).acquireContinent(4, {
        value: 100000000000000000n,
      })
    ).to.emit(ContinentToken, "ContinentSold");
  });
  it("will revert when tryin to buy a non-existant continent", async () => {
    expect(
      ContinentToken.connect(purchaser).acquireContinent(11, {
        value: 100000000000000000n,
      })
    ).to.be.reverted;
  });
  it("can return status on all continents", async () => {
    expect(
      await ContinentToken.connect(contractOwner).allContinentsStatus()
    ).to.deep.equal([
      ["Africa", "0x0000000000000000000000000000000000000000"],
      ["Antarctica", "0x0000000000000000000000000000000000000000"],
      ["Asia", "0x0000000000000000000000000000000000000000"],
      ["Europe", "0x0000000000000000000000000000000000000000"],
      ["North America", "0x0000000000000000000000000000000000000000"],
      ["Oceania", "0x0000000000000000000000000000000000000000"],
      ["South America", "0x0000000000000000000000000000000000000000"],
    ]);
    await ContinentToken.connect(purchaser).acquireContinent(4, {
      value: 100000000000000000n,
    });
    expect(
      await ContinentToken.connect(contractOwner).allContinentsStatus()
    ).to.deep.equal([
      ["Africa", "0x0000000000000000000000000000000000000000"],
      ["Antarctica", "0x0000000000000000000000000000000000000000"],
      ["Asia", "0x0000000000000000000000000000000000000000"],
      ["Europe", "0x0000000000000000000000000000000000000000"],
      ["North America", purchaser.address],
      ["Oceania", "0x0000000000000000000000000000000000000000"],
      ["South America", "0x0000000000000000000000000000000000000000"],
    ]);
  });
  it("can return the owner of a continent", async () => {
    await ContinentToken.connect(purchaser).acquireContinent(4, {
      value: 100000000000000000n,
    });
    expect(
      await ContinentToken.connect(contractOwner).getContinentOwner(4)
    ).to.equal(purchaser.address);
  });
  it("can relinquish a continent", async () => {
    await ContinentToken.connect(purchaser).acquireContinent(4, {
      value: 100000000000000000n,
    });
    expect(
      await ContinentToken.connect(purchaser).relinquishContinent(4)
    ).to.emit(ContinentToken, "ContinentBurned");
    expect(
      await ContinentToken.connect(contractOwner).getContinentOwner(4)
    ).to.equal("0x0000000000000000000000000000000000000000");
  });
  it("can transfer a token", async () => {
    await ContinentToken.connect(purchaser).acquireContinent(4, {
      value: 100000000000000000n,
    });
    expect(
      await ContinentToken.connect(purchaser).transferContinent(
        purchaser.address,
        contractOwner.address,
        4
      )
    ).to.emit(ContinentToken, "Transfer");
    expect(
      await ContinentToken.connect(contractOwner).getContinentOwner(4)
    ).to.equal(contractOwner.address);
  });
});
