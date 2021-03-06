import lockABI from "config/abi/Lock.json";
import PancakeswapPairABI from "config/abi/PancakeswapPair.json";
import ERC20ABI from "config/abi/IERC20.json";
import Web3 from 'web3';

declare let window: any;
const RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, {
  timeout: 10000
});

/**
 * Provides a web3 instance using wallet provider
 */

const getContract = async (address : any, abi : any) => {
  const contract = await new window.web3.eth.Contract(abi, address);
  //TODO Check chain id on functions calling getContract
  return { contract };
};

export const getLockContract = async () => {
  const { contract } = await getContract(
    "0x1173009A09519DD762ba8D2d1cf1992657570011",
    lockABI
  );
  return contract;
};
export const getPancakeswapPairContract = async (address  : any) => {
  const { contract } = await getContract(address, PancakeswapPairABI);
  return contract;
};
export const getERC20Contract = async (address : any) => {
  const { contract } = await getContract(address, ERC20ABI);
  return contract;
};
