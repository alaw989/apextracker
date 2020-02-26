import React from "react";
import styled from "styled-components";
import { svgs } from "../utils.js";

const UserInfoContainer = styled.div`
.row {
  width: 100%;
  .left {
    display: flex;
    align-items: center;
    img {
      border-radius: 50%;
      width: 100px;
    }
  }
  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    img {
      width: 80px;
    }
  }
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  transition: 1s;
  opacity: ${props => props.user === "" ? "0" : "1"};
  transform: ${props => props.user === "" ? "translateY(50px)" : "translateY(0px)"};
}


  h1 {
    color: #fff;
    font-size: 3vw;
    font-weight: 700;
  }
`;



const UserInfoBlock = ({ userinfo }) => {

  const platformCode = userinfo.platformCode;
  return (
    <div className="container margin">
     
        <UserInfoContainer user={userinfo.avatar}>
        <div className="row">
          <div className="col-sm-6 left">
            <div className="col-sm-4">
              <img src={userinfo.avatar} alt=""></img>
            </div>
            <div className="col-sm-8">
              <div>
                {platformCode === 5
                  ? svgs.pc
                  : platformCode === 1
                  ? svgs.xbox
                  : platformCode === 2
                  ? svgs.ps4
                  : null}
              </div>
              <h1>{userinfo.name}</h1>
            </div>
          </div>
          <div className="col-sm-6 right">
            <img src={userinfo.iconUrl} alt=""></img>
          </div>
          </div>
        </UserInfoContainer>
      

    </div>
  );
};


export default UserInfoBlock;
