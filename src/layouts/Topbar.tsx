import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import Web3 from "web3";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { createSemanticDiagnosticsBuilderProgram } from "typescript";

declare let window: any;

interface TopbarProps {
  account: string;
  setAccount: any;
}

const Topbar: React.FC<TopbarProps> = ({ account, setAccount }) => {
  let ellipsis = account
    ? account.slice(0, 4) +
    "..." +
    account.substring(account.length - 4, account.length)
    : "Connect Wallet";
  const onConnect = async () => {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log(chainId / 1);
      if (chainId / 1 !== 97) {
        setAccount(null);
        const data = [{
          chainId: '0x61',
          chainName: 'BSC TESTNET',
          nativeCurrency:
          {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
          },
          rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
          blockExplorerUrls: ['https://bscscan.com/'],
        }]
        try {
          const tx = await window.ethereum.request({ method: 'wallet_addEthereumChain', params: data });
        }
        catch (error) {
          console.log(error);
        }
      }
      else {
        try {
          console.log("DDDD");
          await window.ethereum.enable();
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          console.log(accounts);
          window.web3 = new Web3(window.ethereum);
          setAccount(accounts[0]);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  // useEffect(() => {
  //   if (window.ethereum) {
  //     window.ethereum.on("accountsChanged", function (accounts: any) {
  //       console.log("AccountChanged");
  //       onConnect();
  //     });
  //     window.ethereum.on('networkChanged', function (networkId: any) {
  //       // Time to reload your interface with the new networkId
  //       onConnect();

  //     })
  //   }
  // }, [window.ethereum])

  const [enableMobile, setEnableMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [clickMenu, setClickMenu] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth < 1026 && clickMenu) {
        setClickMenu(true);
      }
      if (window.innerWidth > 1026) {
        setClickMenu(false);
      }
    });
    window.web3 = new Web3(new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'));
  }, [])

  return (
    <StyledContainer>
      <LogoContainer><img src="/images/logo.png" alt="logo" /></LogoContainer>
      <LogoIconContainer><img src="/images/logoicon.png" alt="logo" /></LogoIconContainer>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box display="flex" flexDirection="column" alignItems="center" position="relative">
          <MenuContainer onClick={() => {setShowMenu(!showMenu);setClickMenu(true);}}>
            |||
          </MenuContainer>
          {showMenu && clickMenu && <MenuList>
            <Link to={'/'}>
              <Box>Create Lock</Box>
            </Link>
            <Link to={'/tokenlist'}>
              <Box>Token</Box>
            </Link>
            <Link to={'/liquiditylist'}>
              <Box>Liquidity</Box>
            </Link>
          </MenuList>
          }
        </Box>
        <ExpandmenuContainer>
          <Menus>
            <Link to={'/'}>
              <Box>Create Lock</Box>
            </Link>
            <Link to={'/tokenlist'}>
              <Box>Token</Box>
            </Link>
            <Link to={'/liquiditylist'}>
              <Box>Liquidity</Box>
            </Link>
          </Menus>
        </ExpandmenuContainer>
        <Button type="secondary" onClick={() => !account.length && onConnect()}>
          {ellipsis}
        </Button>
      </Box>
    </StyledContainer>
  );
};

const MenuContainer = styled(Box)`
        border-radius: 10px;
        color: white;
        padding: 14px 15px;
        text-align: center;
        margin: 0px 10px;
        background-image: linear-gradient(to left,#7a47ab,#37046b);
        @media (min-width: 1026px) {
          display: none;
        }
      `;
const LogoContainer = styled(Box)`
      @media (max-width: 450px) {
        display: none;
      }
    `;
const LogoIconContainer = styled(Box)`
    @media (min-width: 450px) {
      display: none;
    }
  `;
const ExpandmenuContainer = styled(Box)`
      @media (max-width: 1026px) {
        display: none;
      }
    `;
const MenuList = styled(Box)`
      position: absolute;
      top: 50px;
      left: 0;
      cursor : pointer;
      font-size: 20px;
      min-width: 120px;
      z-index: 9999;
      padding: 10px 10px;
      border-radius: 10px;
      background: #151f4a;
      margin-top: 5px;
      color: white;
      @media (min-width: 1026px) {
        display: none;
      }
  `;
const StyledContainer = styled(Box)`
        position: fixed;
        top: 0;
        z-index: 10;
        display: flex;
        justify-content: space-between;
        padding: 20px 40px;
        width: 100%;
        align-items: center;
        background : #252f5a;
  `;

const Menus = styled(Box)`
        display: flex;
        justify-content: space-between;
        color: white;
        font-size: 24px;
        >a>div{
            color : white;
              cursor : pointer;
              transition : all 0.4s;
              opacity : 0.6;
              padding-right : 100px;
              :hover{
                font-weight: 500;
                color : red;
            }
        }
    `;

export default Topbar;
