import styled from "styled-components";


const Input = styled.div`
  .row {
    display: flex;
    align-items: center;
  }

  .svg-wrapper {
    background-color: #fff;
    padding: 11px 3px 11px 3px !important;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .icon-container div {
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 1s;
    }

    .icon-container.active div {
        svg path {
        fill: #D33134;
      }
    }

    .icon-container:hover {
      cursor: pointer;
      svg path {
        fill: #98a0ba;
      }
    }
  }

  .svg-wrapper:after {
    content: "";
    position: absolute;
    right: 0;
    z-index: 100;
    top: 25%;
    width: 1px;
    height: 50%; /* or 100px */
    background: #cad0e3;
  }
`;

export default Input;
