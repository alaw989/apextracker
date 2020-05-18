import styled from "styled-components";
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { svgs } from "../utils.js";
import { mq } from "../_mixins.js";

const SearchButton = ({ loadingState, isClicked }) => {
  const SearchIcon = styled.div`
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.5s;
      padding: 10px 0px;
    }
    button:hover {
      background-color: hsla(0, 0%, 100%, 0.2);
    }
    p {
      margin: 0;
      font-size: 15px;
    }
    svg {
      fill: #fff;
      width: 16px;
      margin-right: 15px;
    }
  `;

  return (
    <SearchIcon>
      <button onClick={isClicked}>
        {" "}
        {loadingState === false ? (
          svgs.searchicon
        ) : (
          <ClipLoader
            sizeUnit={"px"}
            size={20}
            color={"#fff"}
            loading={loadingState}
          ></ClipLoader>
        )}
        <p>SEARCH</p>
      </button>
    </SearchIcon>
  );
};

export default SearchButton;
