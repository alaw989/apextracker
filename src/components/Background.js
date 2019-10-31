import React, {} from "react";
import ReactDOM from "react-dom";
import styled from 'styled-components'

const Background = styled.div`
    background-image: url(${props => props.bgData});
    padding: 65px 0 275px 0;
    display: flex;
    justify-content: flex-start ;
    flex-direction: column;
    align-items: center;
    background-size: cover;
    background-color: #C33031;
    input {
        padding: 10px 400px 10px 10px;
    }
`;

export default Background;