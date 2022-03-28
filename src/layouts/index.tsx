import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Box } from '@material-ui/core'
import styled from 'styled-components'
import { enableBodyScroll } from 'body-scroll-lock'

import Topbar from './Topbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

interface Props {
    children?: any;
    account: string,
    setAccount: any
}

const Layout: React.FC<Props> = ({ children, account, setAccount }: any) => {
    const [showWallet, setShowWallet] = useState(false);
    const bodyRef = useRef<any>()

    return (

        <StyledContainer>
            <Topbar account={account} setAccount={setAccount} />
            <Sidebar />
            <Overlay showwallet={showWallet ? 1 : 0} onClick={() => {
                setShowWallet(false)
                enableBodyScroll(bodyRef.current)
            }} />

            <Body component='main' {...{ ref: bodyRef }}>
                <BridgeBody>
                    <Bridge>
                        {children}
                    </Bridge >
                </BridgeBody >
            </Body>

            <Footer />
        </StyledContainer >
    );
}

const Overlay = styled(Box) <{ showwallet: any; }>`
    position: fixed;
    inset: 0px;
    z-index: 30;
    opacity: ${({ showwallet }) => showwallet ? 1 : 0};
    height: ${({ showwallet }) => showwallet ? 'auto' : '0px'};
    transition: opacity 0.3s ease-in-out 0s;
    background-color: rgba(0, 0, 0, 0.15);
`

const StyledContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background : #0b122e;
`

const Body = styled(Box)`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-top : 100px;
`

const BridgeBody = styled(Box)`
  display: flex;
  justify-content: center;
  background-color: #0b122e;
  width : 100%;
`;

const Bridge = styled(Box)`
  padding : 0px 50px 0px 50px;
  color: #04BBFB;
  background: transparent;
  border-top-right-radius: 50px;
  border-bottom-left-radius: 50px;
  box-shadow: inset 0px 0px 10px 7px #4e1b81;
  // width: 85%;
  width : 70%;
  margin-top: 30px;
  margin-bottom: 30px;
  @media (max-width: 1026px) {
    padding: 0px;
    width: 90%;
  }
`

Layout.propTypes = {
    children: PropTypes.node.isRequired
}

export default Layout;