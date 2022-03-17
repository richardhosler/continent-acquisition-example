async function main() {
    // We get the contract to deploy
    const ContinentContract = await ethers.getContractFactory("ContinentToken");
    const continentContract = await ContinentContract.deploy();

    await continentContract.deployed();

    console.log("Contract deployed to:", continentContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
