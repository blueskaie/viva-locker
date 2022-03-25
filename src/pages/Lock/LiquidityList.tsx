import React, { useState, useEffect } from "react";
import { Card, Container, Box } from "@material-ui/core";
import TextInput from "../../components/TextInput";
import styled from "styled-components";

import {
  getERC20Contract,
  getLockContract,
  getPancakeswapPairContract,
} from "../../utils/contractHelpers";

export default function LiquidityList() {
  const [criteria, setCriteria] = useState<any>("");
  const [tab, setTab] = useState<any>(0);
  const [tokendatas, setTokenDatas] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const LockContract = await getLockContract();
        const allLocks = await LockContract.methods
          .getCumulativeLpTokenLockInfo(0, 1000)
          .call();
        console.log(allLocks);
        let temp: any = [];
        for (let i = 0; i < allLocks.length; i++) {
          const PairContract = await getPancakeswapPairContract(
            allLocks[i].token
          );
          const token1 = await PairContract.methods.token0().call();
          const token2 = await PairContract.methods.token1().call();
          const token1contract = await getERC20Contract(token1);
          const token2contract = await getERC20Contract(token2);
          const token1name = await token1contract.methods.name().call();
          const token2name = await token2contract.methods.name().call();
          const token1symbol = await token1contract.methods.symbol().call();
          const token2symbol = await token2contract.methods.symbol().call();
          const decimals = await PairContract.methods.decimals().call();
          const t = {
            name: token1name + "/" + token2name,
            symbol: token1symbol + "/" + token2symbol,
            decimals,
            data: allLocks[i],
          };
          temp.push(t);
          if (i === allLocks.length - 1) setTokenDatas(temp);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-center">
        <Box className="py-4 staking-padding bg-transparent w-100 px-5 py-5">
          <TextInput
            setValue={setCriteria}
            value={criteria}
            type={"text"}
            placeholder={"Search by token address..."}
            validationString=""
          />
          <SwitchTheme>
            <Box display="flex">
              <SwitchButton active={tab === 0} onClick={() => setTab(0)}>
                All
              </SwitchButton>
              <SwitchButton active={tab === 1} onClick={() => setTab(1)}>
                My lock
              </SwitchButton>
            </Box>
          </SwitchTheme>
          <Box mt={"10px"}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Box width={"50%"} fontWeight={"bold"}>
                Token
              </Box>
              <Box width={"50%"} fontWeight={"bold"}>
                Amount
              </Box>
            </Box>
            {tokendatas.map((data: any) => {
              return (
                <Box
                  key={data}
                  display="flex"
                  alignItems={"center"}
                  my={"10px"}
                >
                  <Box width="50%" display="flex" alignItems={"center"}>
                    <Box>
                      <img src="/icons/thinking.png" width={44} />
                    </Box>
                    <Box ml="10px">
                      <Box fontWeight={"bold"}>{data.name}</Box>
                      <Box>{data.symbol}</Box>
                    </Box>
                  </Box>
                  <Box
                    width="50%"
                    display="flex"
                    justifyContent={"space-between"}
                    style={{ cursor: "pointer" }}
                  >
                    <Box>
                      {data.data.amount / Math.pow(10, data.decimals)}
                    </Box>
                    <a href={"/lock/token/" + data.data.token}>
                      <Box color="#c494ff" style={{ cursor: "pointer" }}>
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
const SwitchTheme = styled(Box)`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 5px;
`;
const SwitchButton = styled(Box) <{ active: any }>`
  cursor: pointer;
  margin-right: 10px;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? "bold" : "normal")};
  color: ${({ active }) => (active ? "#c494ff" : "grey")};
  border-bottom: ${({ active }) =>
    active ? "1px dotted #c494ff" : "1px dotted grey"};
  transition: all 0.2s;
`;
