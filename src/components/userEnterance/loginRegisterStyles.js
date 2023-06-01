import styled from "styled-components";
import { Button } from "@mui/material";


export const Wrapper = styled.div`
    width: 400px;
    padding: 30px;
    // margin: auto;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 3px 3px 3px 3px #0000001f;
    border-radius: 5px;
    h3, p {
        text-align: center;
    }
`;

export const Title = styled.div`
    color: var(--blue);
    font-weight: bold;
    font-size: 1.8rem;
    text-align: center;
    padding-bottom: 1rem;
}
`

export const SubmitButton = styled(Button)({
    width: "90%",
    marginLeft: "5% !important",
    marginTop: "12px !important",
    background: "var(--blue) !important"
});

export const LoginInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 15px;
`

export const FieldError = styled.p`
    color: #bf1650;
    &:before {
        display: inline;
        content: "⚠ ";
    }
`

export const BirthdayLabel = styled.p`
    font-size: 14px;
    text-align: left !important;
    margin-bottom: 0;
`;