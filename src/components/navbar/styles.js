import styled, { css } from "styled-components";
import { Button } from "@mui/material";

export const Container = styled.div`
    height: 55px;
    position: sticky;
    width: 100%;
    background: var(--blue);
`

export const NavbarButtons = styled.div`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
`


export const NavbarButton = styled(Button)`
    font-weight: bold !important;
    margin-left: 2rem !important;
    text-transform: none !important;
    color: white !important;
    max-height: 40px;
    ${({ isSelected }) =>
        isSelected &&
        css`
      background-color: white !important;
      color: var(--blue) !important;
    `}
`

export const RightSide = styled.div`
    display: flex;
    align-items: center;
    color: white;
    margin-right: 8px;
`