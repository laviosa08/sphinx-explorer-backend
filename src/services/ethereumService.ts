import Web3 from "web3";
import axios from "axios";
import { handleError } from "../utils/errorHandler";
import { USDC_ABI } from "../utils/abi";
import { ethers } from "ethers";
import { Response } from "express";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
require("dotenv").config();

const INFURA_URL = process.env.INFURA_URL;
const USDC_CONTRACT_ADDRESS = process.env.USDC_CONTRACT_ADDRESS || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const USDC = "USDC";

export async function getUSDCBalance(
  address: string,
  res: Response
): Promise<string> {
  try {
    const provider = new ethers.JsonRpcProvider(INFURA_URL);
    const contract = new ethers.Contract(
      USDC_CONTRACT_ADDRESS,
      USDC_ABI,
      provider
    );
    //check if address is valid
    const isValidAddress = ethers.isAddress(address);
    if(!isValidAddress){
      let error = 'Invalid Address';
      throw error;
    }

    const balance = await contract.balanceOf(address);

    // Convert the balance to a string and format it
    return ethers.formatUnits(balance, 6);
  } catch (error) {
    handleError(res, error);
    throw error;
  }
}

export async function getUSDCTransactions(
  address: string,
  res: Response
): Promise<any> {
  try {

    //check if address is valid
    const isValidAddress = ethers.isAddress(address);
    if(!isValidAddress){
      let error = 'Invalid Address';
      throw error;
    }

    const chain = EvmChain.ETHEREUM;
    const transactionsRequest = {
      chain: chain,
      address: address,
    };

    const recentTransactions =
      await Moralis.EvmApi.token.getWalletTokenTransfers(transactionsRequest);

    const transactions = recentTransactions.toJSON().result?.map((event) => {
      const {
        transaction_hash,
        from_address,
        to_address,
        value,
        token_symbol,
      } = event;
      const amount = ethers.formatUnits(value, 6);
      return {
        hash: transaction_hash,
        from: from_address,
        to: to_address,
        value: amount,
        symbol: token_symbol,
      };
    });

    return transactions?.filter((transaction) => {
      return transaction.symbol === USDC;
    });
  } catch (error) {
    handleError(res, error);
    throw error;
  }
}
