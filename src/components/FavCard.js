import styled from "styled-components";
import React from "react";
import { useSpring, animated } from "react-spring";

const FavLegendBar = styled.div`
  .container {
    display: flex; 
    position: relative; 
    padding: 10px 0; 
    .upper,
    .lower {
      display: flex;
      align-items: center; 

    }

    .upper {
      align-items: center;
    }

    .lower {
      position: absolute; 
      top: 50%; 
      transform: translateY(-10px);
      right: 0;
    }

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
          <div className="container">
            <div className="upper">
              <img
                src={favstats.metadata.imageUrl}
                className="img-responsive"
                alt=""
              />
              <p>{favstats.metadata.name}</p>
            </div>
            <div className="lower">
              <p>{favstats.stats.kills.displayName}</p>
              <p> {favstats.stats.kills.displayValue}</p>
            </div>
          </div>
        </animated.div>
      </FavLegendBar>
    </div>
  );
};

export default FavCard;
