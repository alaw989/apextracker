import React from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";

const StatCardWrapper = styled.div`
  .statcard {
    display: flex;
    background-color: #24283c;
    padding: 20px 20px;
    border: 1px solid #424761;
    justify-content: space-between;
    text-decoration: none;
    color: inherit;
    margin: 5px 0px;
    background-image: url(https://d6d90m6b4vcx.cloudfront.net/prod/release-2.5.1-d215206e/react-apex/static/media/dotsline.0b7dfe8a.svg);
    background-position-x: -1px;
    background-position-y: -1px;
    background-size: unset;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 10px 100%, 0 calc(100% - 14px));
   
    /* opacity: ${props => (props.stat === "" ? "0" : "1")}; */
    /* transform: ${props =>
      props.stat === "" ? "translateY(50px)" : "translateY(0px)"}; */
  }

  .statcard p {
    margin: 0;
  }
`;

const StatCard = ({ stats }) => {

  const props = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(50px)" }
  });

  return (
    <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12 card-column">
      <StatCardWrapper stat={stats.stat}>
        <animated.div className="statcard" style={props}>
          {" "}
          <p>{stats.subtitle}</p>
          <p> {stats.stat}</p>
        </animated.div>
      </StatCardWrapper>
    </div>
  );
};

export default StatCard;
