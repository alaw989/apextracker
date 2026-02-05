import styled from "styled-components";

const AnimateAll = styled.div`
  opacity: ${props => (props.rerenderAnimate ? 1 : 0)};
  transition: all 1s;
  width: 100%;
`;

export default AnimateAll;
