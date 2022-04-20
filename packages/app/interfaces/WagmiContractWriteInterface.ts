import { CallOverrides, ethers } from "ethers";

export interface WagmiContractWriteResponse {
  data: ethers.providers.TransactionResponse;
  error: undefined;
}

export interface WagmiContractWriteResponseError {
  data: undefined;
  error: Error;
}

export interface WagmiContractWriteConfig {
  args?: any;
  overrides?: CallOverrides | undefined;
}
