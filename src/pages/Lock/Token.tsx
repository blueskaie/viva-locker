import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Container, Box } from "@material-ui/core";
import styled from "styled-components";

import {
  getERC20Contract,
  getLockContract,
  getPancakeswapPairContract,
} from "../../utils/contractHelpers";

export default function Token() {
  const [tokendata, setTokenData] = useState<any>(null);
  const [tokenrecord, setTokenRecord] = useState<any>([]);
  const [isLpToken, setIsLpToken] = useState<any>(false);
  const { id }: any = useParams();
  const labels = [
    "Total Amount Locked",
    "Total Values Locked",
    "Token Address",
    "Token Name",
    "Token Symbol",
    "Token Decimals",
  ];
  const lplabels = [
    "Total Amount Locked",
    "Total Values Locked",
    "Liquidity Address",
    "Pair Name",
    "Dex",
  ];
  useEffect(() => {
    async function fetchData() {
      const lockContract = await getLockContract();
      const tokenContract = await getERC20Contract(id);
      const name = await tokenContract.methods.name().call();
      const symbol = await tokenContract.methods.symbol().call();
      const decimals = await tokenContract.methods.decimals().call();
      const record = await lockContract.methods
        .getLocksForToken(id, 0, 1000)
        .call();
      let amount = 0;
      record.map((data: any) => (amount += data.amount / 1));
      let texts = [];
      if (symbol === "Cake-LP") {
        setIsLpToken(true);
        const PairContract = await getPancakeswapPairContract(id);
        const token1 = await PairContract.methods.token0().call();
        const token2 = await PairContract.methods.token1().call();
        const token1contract = await getERC20Contract(token1);
        const token2contract = await getERC20Contract(token2);
        const token1symbol = await token1contract.methods.symbol().call();
        const token2symbol = await token2contract.methods.symbol().call();
        texts[0] = `${amount / Math.pow(10, decimals)}`;
        texts[1] = "$0";
        texts[2] = id;
        texts[3] = `${token1symbol}/${token2symbol}`;
        texts[4] = `Pancakeswap`;
        texts[5] = decimals;
      } else {
        texts = [
          `${amount / Math.pow(10, decimals)} ${symbol}`,
          `$0`,
          id,
          name,
          symbol,
          decimals,
        ];
        setIsLpToken(false);
      }
      const temp: any = { texts };
      setTokenData(temp);
      setTokenRecord(record);
      console.log(record);
    }
    fetchData();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-center mt-5 flex-column">
        <Box className="py-3 staking-padding bg-transparent w-100">
          <CardTitle>Lock info</CardTitle>
          <Box className="p-4">
            {tokendata &&
              !isLpToken &&
              labels.map((data, i) => {
                return (
                  <Box
                    borderBottom="1px solid grey"
                    display="flex"
                    justifyContent="space-between"
                    py={"10px"}
                  >
                    <Box>{data}</Box>
                    {i === 2 ? (
                      <a
                        href={
                          "https://testnet.bscscan.com/address/" +
                          tokendata.texts[i]
                        }
                        target="_blank"
                      >
                        <LongTextContainer color={"#f95192"}>{tokendata.texts[i]}</LongTextContainer>
                        <ShortTextContainer color={"#f95192"}>{tokendata.texts[i].slice(0, 4) + '...' + tokendata.texts[i].slice(tokendata.texts[i].length - 4, tokendata.texts[i].length)}</ShortTextContainer>
                      </a>
                    ) : i === 0 ? (<Box>{Math.floor(parseFloat(tokendata.texts[i]) * 100000) / 100000}</Box>) : (
                      <Box>{tokendata.texts[i]}</Box>
                    )}
                  </Box>
                );
              })}
            {tokendata &&
              isLpToken &&
              lplabels.map((data, i) => {
                return (
                  <Box
                    borderBottom="1px solid grey"
                    display="flex"
                    justifyContent="space-between"
                    py={"10px"}
                  >
                    <Box>{data}</Box>
                    {i === 2 || i === 3 ? (
                      <a
                        href={
                          "https://testnet.bscscan.com/address/" +
                          tokendata.texts[2]
                        }
                        target="_blank"
                      >
                        <Box color={"#f95192"}>{tokendata.texts[i]}</Box>
                      </a>
                    ) : i === 0 ? (<Box>{Math.floor(parseFloat(tokendata.texts[i]) * 100000) / 100000}</Box>) : (
                      <Box>{tokendata.texts[i]}</Box>
                    )}
                  </Box>
                );
              })}
          </Box>
        </Box>

        <Box className="py-3 staking-padding bg-transparent  w-100 mt-4">
          <CardTitle>Lock records</CardTitle>
          <Box className="p-4">
            <Box display={"flex"} justifyContent={"space-between"}>
              <Box width={"30%"}>Wallet Address</Box>
              <Box width={"30%"}>Amount</Box>
              <Box width={"40%"}>Unlock Time</Box>
            </Box>
            {tokenrecord.map((data: any) => {
              const ellipsis =
                data.owner.slice(0, 4) +
                "..." +
                data.owner.substring(
                  data.owner.length - 4,
                  data.owner.length
                );
              return (
                <Box
                  borderBottom={"1px solid grey"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  py={"10px"}
                >
                  <Box width={"30%"}>
                    <a
                      href={
                        "https://testnet.bscscan.com/address/" + data.owner
                      }
                      target="_blank"
                    >
                      <Box color={"#f95192"}>{ellipsis}</Box>
                    </a>
                  </Box>
                  <Box width={"30%"}>
                    {Math.floor((data.amount / Math.pow(10, tokendata.texts[5])) * 100000) / 100000}
                  </Box>
                  <Box
                    width={"40%"}
                    display={"flex"}
                    justifyContent={"space-between"}
                  >
                    <Box>
                      {new Date(data.unlockDate * 1000).toUTCString()}
                    </Box>
                    <a href={"/lock/tokenrecord/" + data.id}>
                      <Box color={"#c494ff"} style={{ cursor: "pointer" }}>
                        View
                      </Box>
                    </a>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </div>

    </>
  );
}
const CardTitle = styled(Box)`
  font-weight: bold;
  font-size: 20px;
  padding: 10px;
  margin: 0px 20px;
  border-bottom: 1px solid grey;
`;
const LongTextContainer = styled(Box)`
      @media (max-width: 500px) {
        display: none;
      }
    `;
const ShortTextContainer = styled(Box)`
    @media (min-width: 500px) {
      display: none;
    }
  `;
