/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["flagcdn.com", "upload.wikimedia.org"],
  },
  env: {
    NEXT_PUBLIC_ETHERSCAN_API_KEY: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
    NEXT_PUBLIC_RINKEBY_URL: process.env.NEXT_PUBLIC_RINKEBY_URL,
    NEXT_PUBLIC_METAMASK_PRIVATE_KEY:
      process.env.NEXT_PUBLIC_METAMASK_PRIVATE_KEY,
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  },
};

module.exports = nextConfig;
