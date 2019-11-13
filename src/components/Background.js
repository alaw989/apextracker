import styled from "styled-components";
import { backgrounds } from "../utils.js";

const Background = styled.div`
  background-image: url(${props =>
    props.bgData === "Pathfinder"
      ? backgrounds.pathfinder
      : props =>
          props.bgData === "Bangalore"
            ? backgrounds.bangalore
            : props =>
                props.bgData === "Bloodhound"
                  ? backgrounds.bloodhound
                  : props =>
                      props.bgData === "Caustic"
                        ? backgrounds.caustic
                        : props =>
                            props.bgData === "Crypto"
                              ? backgrounds.crypto
                              : props =>
                                  props.bgData === "Gibraltar"
                                    ? backgrounds.gibraltar
                                    : props =>
                                        props.bgData === "Lifeline"
                                          ? backgrounds.lifeline
                                          : props =>
                                              props.bgData === "Mirage"
                                                ? backgrounds.mirage
                                                : props =>
                                                    props.bgData === "Wraith"
                                                      ? backgrounds.wraith
                                                      : props =>
                                                          props.bgData ===
                                                          "Octane"
                                                            ? backgrounds.octane
                                                            : null});
  background: 
    /* top, transparent red, faked with gradient */ linear-gradient(
      0deg,
      rgba(30, 35, 52, 1) 0%,
      rgba(30, 35, 52, 0) 50%,
      rgba(30, 35, 52, 1) 100%
    ),
    /* bottom, image */
      url(${props =>
        props.bgData === "Pathfinder"
          ? backgrounds.pathfinder
          : props =>
              props.bgData === "Bangalore"
                ? backgrounds.bangalore
                : props =>
                    props.bgData === "Bloodhound"
                      ? backgrounds.bloodhound
                      : props =>
                          props.bgData === "Caustic"
                            ? backgrounds.caustic
                            : props =>
                                props.bgData === "Crypto"
                                  ? backgrounds.crypto
                                  : props =>
                                      props.bgData === "Gibraltar"
                                        ? backgrounds.gibraltar
                                        : props =>
                                            props.bgData === "Lifeline"
                                              ? backgrounds.lifeline
                                              : props =>
                                                  props.bgData === "Mirage"
                                                    ? backgrounds.mirage
                                                    : props =>
                                                        props.bgData ===
                                                        "Wraith"
                                                          ? backgrounds.wraith
                                                          : props =>
                                                              props.bgData ===
                                                              "Octane"
                                                                ? backgrounds.octane
                                                                : null});
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
