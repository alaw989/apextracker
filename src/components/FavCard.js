import styled from "styled-components";
import React from "react";

const FavLegendBar = styled.div`
  p {
    color: #fff;
    text-transform: uppercase;
  }
`;

const FavCard = ({ favstats }) => {
  return (
    <div className="col-sm-12 legend-bar">
      <FavLegendBar>
        <p>{favstats.favName}</p>
      </FavLegendBar>
    </div>
  );
};

export default FavCard;
