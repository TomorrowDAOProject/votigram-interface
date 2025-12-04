import { getContractBasic } from "@portkey/contracts";
import { aelf } from "@portkey/utils";

import { EVoteOption } from "@/types/contract";

type VotePortkeyParams = {
  votingItemId: string;
  voteOption: EVoteOption;
  voteAmount: number;
  memo: string;
};

type RowTransactionPortkeyParams = {
  caHash: string;
  privateKey: string;
  contractAddress: string;
  caContractAddress: string;
  rpcUrl: string;
  params: VotePortkeyParams;
  methodName: string;
};

export const getRawTransactionPortkey = async ({
  caHash,
  privateKey,
  contractAddress,
  caContractAddress,
  rpcUrl,
  params,
  methodName,
}: RowTransactionPortkeyParams) => {
  try {
    const contract = await getContractBasic({
      callType: "ca",
      caHash: caHash,
      account: aelf.getWallet(privateKey),
      contractAddress: contractAddress,
      caContractAddress: caContractAddress,
      rpcUrl: rpcUrl,
    });

    const transaction = await contract.encodedTx(methodName, params);

    return transaction.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
