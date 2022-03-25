import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import styled from 'styled-components'

let prevtimer: any = null;
interface CountDownProps {
  date?: any;
  action?: any;
}

const CountDown: React.FC<CountDownProps> = ({ date, action }) => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    prevtimer && clearInterval(prevtimer);
    prevtimer = setInterval(function () {
      const temp = Math.floor(Math.max(date - Date.now(), 0) / 1000);
      setSeconds(temp % 60);
      setMinutes(Math.floor(temp / 60) % 60);
      setHours(Math.floor(temp / 3600) % 24);
      setDays(Math.floor(temp / 3600 / 24));
      action && action();
    }, 1000);
  }, [date]);
  return (
    <Box display={"flex"}>
      <CountDownField className="countdown">{days}</CountDownField>
      <CountDownField className="countdown">{hours}</CountDownField>
      <CountDownField className="countdown">{minutes}</CountDownField>
      <CountDownField className="countdown">{seconds}</CountDownField>
    </Box>
  );
}
const CountDownField = styled.span`
    width: 40px;
    height: 40px;
    text-align: center;
    margin: 10px;
    background-color: gray;
    font-size: 20px;
    font-weight: bold;
    border-radius: 3px;
    display : flex;
    justify-content : center;
    align-items : center;
    padding : 5px;
`;
export default CountDown;