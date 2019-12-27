import React from "react";
import styled from "styled-components";
import { svgs } from "../utils.js";

const UserInfoBlock = ({ userinfo }) => {
  //   console.log(svgs);
  //   console.log(userinfo.platformCode);
  const platformCode = userinfo.platformCode;
  const UserInfoContainer = styled.div`
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
    h1 {
      color: #fff;
      font-size: 3vw;
      font-weight: 700;
    }
  `;

  return (
    <div className="container margin">
      <div className="row">
        <UserInfoContainer>
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
        </UserInfoContainer>
      </div>
    </div>
  );
};

export default UserInfoBlock;
