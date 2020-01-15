import styled from "styled-components";

const Error = styled.div`
  opacity: ${props => props.toggleDisplay} !important;
  background-color: #fff;
  width: 100%;
  text-align: center;
  transition: .5s;
  transform: ${props => props.toggleDisplay === "1" ? "translateY(0px)" : "translateY(50px)"};
  p {
    color: #000;
  }
`;

export default Error;
