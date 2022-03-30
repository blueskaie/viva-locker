import React, { useEffect, useState } from "react";
import { Card, Button, Container, TextField, MenuItem, Box } from "@material-ui/core";
import styled from 'styled-components'

import TextInput from "components/TextInput";

import {
  getERC20Contract,
  getLockContract,
  getPancakeswapPairContract,
} from "../../utils/contractHelpers";

const Lock_Addr = "0x433487045A46739378Ff1593E24eFfa67Cbc0691";

interface CreateLockProps {
  account?: any;
  setAccount?: any;
}

const CreateLock: React.FC<CreateLockProps> = ({ account, setAccount }) => {
  const [checkflags, setCheckFlags] = useState<any>(new Array(3).fill(false));
  const [flag, setFlag] = useState<any>(false);

  const [address, setAddress] = useState<any>("");
  const [amount, setAmount] = useState<any>(0);
  const [locktime, setLockTime] = useState<any>(new Date());
  const [pending, setPending] = useState<any>(false);
  const [approveflag, setApproveFlag] = useState<any>(false);
  const [isLpToken, setIsLpToken] = useState<any>(false);

  const [tokenvalues, setTokenValues] = useState<any>(null);
  const [feetype, setFeeType] = useState<any>(1);

  const tokenlabels = ["Name", "Symbol", "Decimals", "Balance"];
  const lptokenlabels = ["Pair", "Dex", "Balance"];
  useEffect(() => {
    async function fetchData() {
      if (!checkflags[0] || !account) return;
      try {
        const contract = await getERC20Contract(address);
        const temp = [];
        const name = await contract.methods.name().call(); //name
        const symbol = await contract.methods.symbol().call(); //symbol
        const decimals = await contract.methods.decimals().call(); //decimals
        const balance =
          (await contract.methods.balanceOf(account).call()) /
          Math.pow(10, decimals); //balance
        const allowance = await contract.methods
          .allowance(account, Lock_Addr)
          .call();
        temp[0] = name;
        temp[1] = symbol;
        temp[2] = decimals;
        temp[3] = balance;
        if (temp[1] === "Cake-LP") {
          setIsLpToken(true);
          const PairContract = await getPancakeswapPairContract(address);
          const token1 = await PairContract.methods.token0().call();
          const token2 = await PairContract.methods.token1().call();
          const token1contract = await getERC20Contract(token1);
          const token2contract = await getERC20Contract(token2);
          const token1symbol = await token1contract.methods.symbol().call();
          const token2symbol = await token2contract.methods.symbol().call();
          temp[0] = `${token1symbol}/${token2symbol}`;
          temp[1] = "Pancakeswap";
          temp[2] = balance;
          temp[3] = null;
        }
        setTokenValues({ text: temp, name, symbol, decimals, balance });
        if (allowance > 0) setApproveFlag(true);
        else setApproveFlag(false);
      } catch (error) {
        console.log(error);
        setApproveFlag(false);
      }
    }
    fetchData();
  }, [address, account, checkflags]);

  useEffect(() => {
    let temp: any = [];
    temp[0] = address.length === 42;
    temp[1] = amount !== 0;
    temp[2] = locktime.getTime() > Date.now();
    setCheckFlags(temp);
    setFlag(temp[0] * temp[1] * temp[2]);
  }, [address, amount, locktime]);

  const onApproveToken = async (address: any) => {
    if (!address.length || !account) return;
    try {
      setPending(true);
      const contract = await getERC20Contract(address);
      await contract.methods
        .approve(
          Lock_Addr,
          "115792089237316195423570985008687907853269984665640564039457584007913129639935"
        )
        .send({ from: account });
      setPending(false);
      setApproveFlag(true);
    } catch (error) {
      console.log(error);
      setPending(false);
      setApproveFlag(false);
    }
  };

  const onLock = async () => {
    setPending(true);
    try {

      const lockContract = await getLockContract();
      const vivatoken = await lockContract.methods.vivatoken().call();
      if (feetype === 2) {
        await onApproveToken(vivatoken);
        const id = await lockContract.methods
          .lock(
            feetype,
            account,
            address,
            isLpToken,
            "0x" + (amount * Math.pow(10, tokenvalues.decimals)).toString(16),
            Math.floor(locktime.getTime() / 1000)
          )
          .send({ from: account });
        console.log(id);
      }
      else {
        const id = await lockContract.methods
          .lock(
            feetype,
            account,
            address,
            isLpToken,
            "0x" + (amount * Math.pow(10, tokenvalues.decimals)).toString(16),
            Math.floor(locktime.getTime() / 1000)
          )
          .send({ from: account});
        console.log(id);
      }
      // window.location.href = "/lock/tokenrecord/" + id;
    } catch (error) {
      console.log(error);
      setPending(false);
    }
  };
  return (

    <div className="d-flex justify-content-center">
      <Box className="py-4 staking-padding bg-transparent w-100 px-5 py-5" fontWeight={'bold'}>
        <div className="d-flex justify-content-between mt-4">
          <div style={{ width: "100%" }}>
            <Box mb={'10px'}>
              FeeType <span style={{ color: "#c494ff" }}>*</span>
            </Box>
            <TextField
              select
              placeholder="Ex: PinkMonn"
              InputProps={{ style: { color: '#c494ff' } }} variant="outlined" type="tel" className="w-100"
              value={feetype}
              onChange={(e) => setFeeType(e.target.value)}
            >
              <MenuItem value={1}>BNB</MenuItem>
              <MenuItem value={2}>Viva Token</MenuItem>
            </TextField>
          </div>
        </div>
        <TextInput
          title={"Token or LP Token address"}
          checkflag={checkflags[0]}
          setValue={setAddress}
          value={address.toLowerCase()}
          type={"text"}
          placeholder={"Enter token or Lp Address"}
          validationString="Invalid Address"
        />
        {checkflags[0] &&
          !isLpToken &&
          tokenvalues &&
          tokenvalues.text.map((data: any, i: any) => {
            return (
              <div key={100 + i}>
                <hr style={{ borderColor: "grey" }} />
                <div className="d-flex justify-content-between">
                  <div>{tokenlabels[i]}</div>
                  <div>{data}</div>
                </div>
              </div>
            );
          })}
        {checkflags[0] &&
          isLpToken &&
          tokenvalues &&
          tokenvalues.text.map((data: any, i: any) => {
            return (
              <>
                <hr style={{ borderColor: "grey" }} />
                <div className="d-flex justify-content-between">
                  <div>{lptokenlabels[i]}</div>
                  <div>{data}</div>
                </div>
              </>
            );
          })}
        <TextInput
          title={"Amount"}
          checkflag={checkflags[1]}
          setValue={setAmount}
          value={amount}
          type={"tel"}
          placeholder={"Enter Amount"}
          validationString="Invalid Amount"
        />
        <TextInput
          title={"Lock until(UTC time)"}
          checkflag={checkflags[2]}
          setValue={setLockTime}
          value={locktime}
          type={"datetime"}
          placeholder={"Select Date"}
          validationString="Unlock time need to be after now"
        />

        {approveflag ? (
          <div className="d-flex justify-content-center mt-3">
            <Button
              size="medium"
              className="font-weight-bold shadow-black-lg btn-secondary text-first m-2"
              disabled={pending || !flag}
              onClick={() => onLock()}
            >
              <div className="d-flex align-items-center">
                <div className="pl-2">Lock</div>
              </div>
            </Button>
          </div>
        ) : (
          ""
        )}

        {!approveflag ? (
          <div className="d-flex justify-content-center mt-3">
            <Button
              size="medium"
              disabled={pending || !account || !flag}
              className="font-weight-bold shadow-black-lg btn-secondary text-first m-2"
              onClick={() => onApproveToken(address)}
            >
              <div className="d-flex align-items-center">
                <div className="pl-2">Approve</div>
              </div>
            </Button>
          </div>
        ) : (
          ""
        )}
      </Box>
    </div>

  );
};



export default CreateLock;

