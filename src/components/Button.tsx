import React from 'react'
import styled from 'styled-components'
import { Box } from '@material-ui/core'
interface Props {
    type: string,
    onClick: any
}
const Button: React.FC<Props> = ({ type, children, onClick }) => {
    return (
        <StyledContainer type={type} onClick={onClick}>
            {children}
        </StyledContainer>
    );
}

const StyledContainer = styled(Box) <{ type: string }>`
    width : 170px;
    height : 50px;
    background-image : linear-gradient(to left, #7a47ab, #37046b);
    color : #a1aed4;
    display : flex;
    justify-content : center;
    align-items : center;
    border-radius : 100px;
    font-size : 18px;
    font-family : 'Myriad Pro Semibold';
    cursor : pointer;
    transition : all 0.2s;
    box-shadow: 'inset 0px 0px 10px 7px #4e1b81';
    :hover{
        background-image : linear-gradient(to right, #7a47ab, #37046b);
        color: #880000;
        transition: all 0.5s;
        transform: translate(0px, -2px);
    }
    :active{
        opacity : 0.5;
    }
`

export default Button;