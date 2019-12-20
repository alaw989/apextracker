import React from "react";
import styled from "styled-components";

const Seperator = styled.div`
    display: ${props => props.toggleDisplay} !important;
    h1 {
        font-weight: 700;
        text-transform: uppercase;
        color: #fff;
    }
    h2 {
        font-weight: 700;
        text-transform: uppercase;
        color: #fff;
    }

    .background {
        padding: 20px 0px 20px 20px;
    background-color: #2C2F46;
    -webkit-clip-path: polygon(0 0,calc(100% - 16px) 0,100% 20px,100% 100%,16px 100%,0 calc(100% - 20px));
    clip-path: polygon(0 0,calc(100% - 16px) 0,100% 20px,100% 100%,16px 100%,0 calc(100% - 20px));
    }
`;
 
export default Seperator;