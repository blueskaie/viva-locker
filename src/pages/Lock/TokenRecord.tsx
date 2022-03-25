import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Container, Box, Button } from "@material-ui/core";
import styled from "styled-components";
import Countdown from "../../components/CountDown";
import {
  getERC20Contract,
  getLockContract,
  getPancakeswapPairContract,
} from "../../utils/contractHelpers";

interface TokenRecordProps {
  account?: any;
  setAccount?: any;
}

const TokenRecord: React.FC<TokenRecordProps> = ({ account, setAccount }) => {
  const [tokendata, setTokenData] = useState<any>(null);
  const [tokeninfo, setTokenInfo] = useState<any>([]);
  const [lockinfo, setLockInfo] = useState<any>([]);
  const [pending, setPending] = useState<any>(false);
  const [isLpToken, setIsLpToken] = useState<any>(false);

  const { id }: any = useParams();

  const tokeninfolabels = [
    "Token Address",
    "Token Name",
    "Token Symbol",
    "Token Decimals",
  ];
  const lptokeninfolabels = [
    "Pair Address",
    "Pair Name",
    "Token",
    "Quote Token",
    "Dex",
  ];
  const lockinfolabels = [
    "Total Amount Locked",
    "Total Values Locked",
    "Owner",
    "Lock Date",
    "Unlock Date",
  ];

  const onUnlock = async () => {
    setPending(true);
    try {
      const lockContract = await getLockContract();
      await lockContract.methods
        .unlock(tokendata.data.id)
        .send({ from: account });
      setPending(false);
      fetchData();
    } catch (error) {
      console.log(error);
      setPending(false);
    }
  };

  const onUpdate = async () => {
    window.location.href = "/lock/editlock/" + tokendata.data.id;
  };

  async function fetchData() {
    const lockContract = await getLockContract();
    const lockdata = await lockContract.methods.getLock(id).call();
    console.log(lockdata);
    const tokenContract = await getERC20Contract(lockdata.token);
    const name = await tokenContract.methods.name().call();
    const symbol = await tokenContract.methods.symbol().call();
    const decimals = await tokenContract.methods.decimals().call();
    let tinfo = [];
    if (symbol === "Cake-LP") {
      setIsLpToken(true);
      const PairContract = await getPancakeswapPairContract(lockdata.token);
      const token1 = await PairContract.methods.token0().call();
      const token2 = await PairContract.methods.token1().call();
      const token1contract = await getERC20Contract(token1);
      const token2contract = await getERC20Contract(token2);
      const token1symbol = await token1contract.methods.symbol().call();
      const token2symbol = await token2contract.methods.symbol().call();
      const token1name = await token1contract.methods.name().call();
      const token2name = await token2contract.methods.name().call();
      tinfo[0] = lockdata.token;
      tinfo[1] = `${token1symbol}/${token2symbol}`;
      tinfo[2] = token1name;
      tinfo[3] = token2name;
      tinfo[4] = `Pancakeswap`;
    } else {
      setIsLpToken(false);
      tinfo = [lockdata.token, name, symbol, decimals];
    }
    setTokenInfo(tinfo);
    const linfo = [
      lockdata.amount / Math.pow(10, decimals) +
      " " +
      (symbol === "Cake-LP" ? "" : symbol),
      "$0",
      lockdata.owner,
      new Date(lockdata.lockDate * 1000).toUTCString(),
      new Date(lockdata.unlockDate * 1000).toUTCString(),
    ];
    setLockInfo(linfo);
    const temp = { data: lockdata };
    setTokenData(temp);
    console.log(temp);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-center mt-5 flex-column">
        <Box className="py-3 staking-padding bg-transparent  w-100">
          <Box
            display={"flex"}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <Box mb={"10px"}>Unlock In</Box>
            <Countdown
              date={tokendata ? tokendata.data.unlockDate * 1000 : 0}
            />
          </Box>
        </Box>
        <Box className="py-3 staking-padding bg-transparent  w-100 mt-4">
          <CardTitle>Token info</CardTitle>
          <Box className="p-4">
            {!isLpToken &&
              tokeninfo.map((data: any, i: any) => {
                return (
                  <Box
                    borderBottom={"1px solid grey"}
                    display={"flex"}
                    justifyContent={"space-between"}
                    py={"10px"}
                  >
                    <Box>{tokeninfolabels[i]}</Box>
                    {i === 0 ? (
                      <a
                        href={"https://testnet.bscscan.com/address/" + data}
                        target="_blank"
                      >
                        <Box color={"#f95192"}>{data}</Box>
                      </a>
                    ) : (
                      <Box>{data}</Box>
                    )}
                  </Box>
                );
              })}
            {isLpToken &&
              tokeninfo.map((data: any, i: any) => {
                return (
                  <Box
                    borderBottom={"1px solid grey"}
                    display={"flex"}
                    justifyContent={"space-between"}
                    py={"10px"}
                  >
                    <Box>{lptokeninfolabels[i]}</Box>
                    {i === 0 ? (
                      <a
                        href={"https://testnet.bscscan.com/address/" + data}
                        target="_blank"
                      >
                        <Box color={"#f95192"}>{data}</Box>
                      </a>
                    ) : (
                      <Box>{data}</Box>
                    )}
                  </Box>
                );
              })}
          </Box>
        </Box>

        <Box className="py-3 staking-padding bg-transparent  w-100 mt-4">
          <CardTitle>Lock Info</CardTitle>
          <Box className="p-4">
            {lockinfo.map((data: any, i: any) => {
              return (
                <Box
                  borderBottom={"1px solid grey"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  py={"10px"}
                >
                  <Box>{lockinfolabels[i]}</Box>
                  {i === 2 ? (
                    <a
                      href={"https://testnet.bscscan.com/address/" + data}
                      target="_blank"
                    >
                      <Box color={"#f95192"}>{data}</Box>
                    </a>
                  ) : (
                    <Box>{data}</Box>
                  )}
                </Box>
              );
            })}
          </Box>
          {tokendata && tokendata.data.owner === account ? (
            <Box mt={"20px"} display={"flex"} justifyContent={"center"}>
              <Box
                display={"flex"}
                width={"220px"}
                justifyContent={"space-between"}
              >
                <Button
                  size="small"
                  disabled={
                    pending ||
                    tokendata.data.amount === "0" ||
                    Date.now() > tokendata.data.unlockDate * 1000
                  }
                  className="font-weight-bold shadow-black-lg btn-secondary text-first my-2"
                  onClick={() => onUpdate()}
                >
                  Update
                </Button>
                <Button
                  size="small"
                  disabled={
                    pending ||
                    Date.now() < tokendata.data.unlockDate * 1000 ||
                    tokendata.data.amount === "0"
                  }
                  className="font-weight-bold shadow-black-lg btn-secondary text-first my-2"
                  onClick={() => onUnlock()}
                >
                  Unlock
                </Button>
              </Box>
            </Box>
          ) : (
            ""
          )}
        </Box>
      </div>

    </>
  );
}
const CardTitle = styled(Box)`
  font-weight: bold;
  font-size: 20px;
  padding: 10px;
  border-bottom: 1px solid grey;
`;
export default TokenRecord;