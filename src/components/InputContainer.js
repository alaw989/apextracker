import styled from "styled-components";

const InputContainer = styled.div`
  width: 100%;
  .search_wrapper {
    background-color: rgb(${props => props.darkness});
    transition: 1s;
  }
`;

export default InputContainer;
