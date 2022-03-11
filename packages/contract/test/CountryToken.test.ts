import { expect, use } from 'chai';
import { Contract } from 'ethers';
import { deployContract, MockProvider, solidity } from 'ethereum-waffle';
import CountryTokenContract from '../build/CountryToken.json';

use(solidity);

describe("Country Token", async () => {
    const [contractOwner, purchaser] = new MockProvider().getWallets();
    let CountryToken: Contract;

    beforeEach(async () => {
        CountryToken = await deployContract(contractOwner, CountryTokenContract);
    });
    it("is deployed", async () => {
        expect(await CountryToken.signer.getAddress()).to.equal(contractOwner.address);
    });
    it("can sell a country", async () => {
        expect(await CountryToken.connect(purchaser).acquireCountry("GBR", { value: 100000000000000000n })).to.emit(CountryToken, "CountrySold");
    })
});
