import React, { useEffect, useState } from "react";
import { Card, Button, Container, Box } from "@material-ui/core";

import { useParams } from "react-router-dom";
import styled from "styled-components";

import TextInput from "../../components/TextInput";
import { getERC20Contract, getLockContract } from "../../utils/contractHelpers";

interface EditLockProps {
  account?: any;
  setAccount?: any;
}

const EditLock: React.FC<EditLockProps> = ({ account, setAccount }) => {
  const [checkflags, setCheckFlags] = useState<any>(new Array(3).fill(false));
  const [flag, setFlag] = useState<any>(false);

  const [amount, setAmount] = useState<any>(0);
  const [locktime, setLockTime] = useState<any>(new Date());
  const [pending, setPending] = useState<any>(false);

  const [tokenvalues, setTokenValues] = useState<any>(null);
  const { id }: any = useParams();

  const tokenlabels = [
    "Token Address",
    "Name",
    "Symbol",
    "Decimals",
    "Balance",
  ];

  useEffect(() => {
    if (!tokenvalues) return;
    let temp: any = [];
    temp[0] = true;
    temp[1] =
      amount > tokenvalues.data.amount / Math.pow(10, tokenvalues.text[3]);
    temp[2] =
      locktime.getTime() > Date.now() &&
      locktime.getTime() > tokenvalues.data.unlockDate * 1000;
    setCheckFlags(temp);
    setFlag(temp[0] * temp[1] * temp[2]);
  }, [id, amount, locktime]);

  async function fetchData() {
    if (!account) return;
    try {
      const lockContract = await getLockContract();
      const lockdata = await lockContract.methods.getLock(id).call();
      const contract = await getERC20Contract(lockdata.token);
      const temp = [];
      temp[0] = lockdata.token;
      temp[1] = await contract.methods.name().call(); //name
      temp[2] = await contract.methods.symbol().call(); //symbol
      temp[3] = await contract.methods.decimals().call(); //decimals
      temp[4] =
        (await contract.methods.balanceOf(account).call()) /
        Math.pow(10, temp[3]); //balance
      setTokenValues({ text: temp, data: lockdata });
      setAmount(lockdata.amount / Math.pow(10, temp[3]));
      setLockTime(new Date(lockdata.unlockDate * 1000));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id, account]);

  const onLock = async () => {
    setPending(true);
    try {
      const lockContract = await getLockContract();
      await lockContract.methods
        .editLock(
          1,
          tokenvalues.data.id,
          "0x" + (amount * Math.pow(10, tokenvalues.text[3])).toString(16),
          Math.floor(locktime.getTime() / 1000)
        )
        .send({ from: account, value: '0x' + Math.pow(10, 17).toString(16) });
      fetchData();

      setPending(false);
    } catch (error) {
      console.log(error);
      setPending(false);
    }
  };
  return (
    <>
      <div className="d-flex justify-content-center mt-5">
        <Box className="py-4 staking-padding bg-transparent w-100 px-5 py-5">
          <CardTitle>Edit your lock</CardTitle>
          {tokenvalues &&
            tokenvalues.text.map((data: any, i: any) => {
              return (
                <>
                  <Box
                    borderBottom={"1px solid grey"}
                    display={"flex"}
                    justifyContent={"space-between"}
                    py={"10px"}
                    mx={"10px"}
                  >
                    <div>{tokenlabels[i]}</div>
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
            validationString="New amount must be not less than current amount"
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

          {tokenvalues && account === tokenvalues.data.owner ? (
            <div className="d-flex justify-content-center mt-3">
              <Button
                size="medium"
                className="font-weight-bold shadow-black-lg btn-secondary text-first m-2"
                disabled={pending || !flag}
                onClick={() => onLock()}
              >
                <div className="d-flex align-items-center">
                  <div className="pl-2">Update your Lock</div>
                </div>
              </Button>
            </div>
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
  padding: 10px 0px;
  border-bottom: 1px solid grey;
  margin-bottom: 20px;
`;
export default EditLock;