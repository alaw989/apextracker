import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Background = styled.div.attrs(props => ({
  darkness: props.darkness,
  bgData: props.bgData
}))`
  background-image: url(${props => props.bgData});
  background: 
    /* top, transparent red, faked with gradient */ linear-gradient(
      0deg,
      rgba(30, 35, 52, 1) 0%,
      rgba(253, 187, 45, 0) 100%
    ),
    /* bottom, image */ url(${props => props.bgData});
  padding: 65px 0 275px 0;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  background-size: cover;

  button {
    background: none;
    border: none;
    color: #fff;
  }

  input {
    padding: 10px 0px 10px 10px;
    border: none;
    width: 100%;
  }

  textarea:focus,
  input:focus {
    outline: none;
  }

  p {
    margin: 10px 60px 10px 30px;
    color: #fff;
    font-weight: 700;
  }

  .search_wrapper {
    display: flex;
    padding: 10px 0;
    width: 100%;
    align-items: center;

    button {
      width: 100%;
    }

    button:hover {
      background-color: blue;
    }
  }
`;

export default Background;
