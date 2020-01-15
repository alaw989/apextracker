import styled from "styled-components";
import React from "react";
import { useSpring, animated } from "react-spring";

const FavLegendBar = styled.div`
  div {
    display: flex;
    align-items: center;
    img {
      width: 75px;
    }
    p {
      color: #fff;
      text-transform: uppercase;
      margin: 0;
    }
  }
`;

const FavCard = ({ favstats }) => {
  const props = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(50px)" }
  });
  return (
    <div className="col-sm-12 legend-bar">
      <FavLegendBar style={props}>
        <animated.div style={props}>
          <img src={favstats.favImage} className="img-responsive" alt="" />
          <p>{favstats.favName}</p>
        </animated.div>
      </FavLegendBar>
    </div>
  );
};

export default FavCard;
