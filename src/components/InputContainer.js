import styled from "styled-components";

const InputContainer = styled.div`
  width: 100%;
  clip-path: polygon(
        0 0,
        100% 0,
        100% 100%,
        10px 100%,
        0 calc(100% - 14px)
      );
  .search_wrapper {
    background-color: rgb(${props => props.darkness});

  }
`;

export default InputContainer;
