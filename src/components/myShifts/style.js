import styled from "styled-components";

export const Title = styled.div`
    color: var(--blue);
    font-weight: bold;
    font-size: 1.9rem;
    margin: 2rem;
    margin-left: 5%;
`;

export const SearchContainer = styled.div`
    background: #f6f6f6;
    display: flex;
    margin-bottom: 1rem;
    border-radius: 10px;
    position: relative;
    left: 5%;
    padding: 5px;
    margin-bottom: 1rem;
    margin-top: 5px;
    max-width: 58rem;
    justify-content: space-around;
    box-shadow: rgb(100 100 111 / 30%) 0px 7px 7px 0px;
}
`;

export const SeachRow = styled.div`
    display: flex;
    align-items: center;
`;


export const SearchBy = styled.div`
    left: 5%;
    position: relative;
    color: var(--blue);
    width: 5rem;
`;

export const PopupBackground = styled.div`
    background: #00000054;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
`;

export const PopupContainer = styled.div`
    background: white;
    position: relative;
    width: 700px;
    height: 500px;
    top: 100px;
    margin: auto;
    border-radius: 10px;
    z-index: 9999;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`
