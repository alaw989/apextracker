import styled from "styled-components";

const Error = styled.div`
  display: ${props => props.toggleDisplay} !important;
  background-color: #fff;
  width: 100%;
  text-align: center;

  p {
    color: #000;
  }
`;

export default Error;
