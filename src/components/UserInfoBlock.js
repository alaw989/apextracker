import React from "react";
import styled from "styled-components";
import { svgs } from "../utils.js";

const UserInfoContainer = styled.div`
  .row {
    width: 100%;
    .left {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      img {
        border-radius: 50%;
        width: 100px;
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-end;

      img {
        width: 80px;
      }
    }

    .avatar-name-container {
      display: flex;
    }

    .platformicon-name-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 10px;
    }

    .hold {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 30px;
    transition: 1s;
    opacity: ${(props) => (props.user === "" ? "0" : "1")};
    transform: ${(props) =>
      props.user === "" ? "translateY(50px)" : "translateY(0px)"};
  }

  h1 {
    color: #fff;
    font-size: 3vw;
    font-weight: 700;
  }
  .nomargin {
    margin: 0 auto; 
  }
`;

const UserInfoBlock = ({ userinfo }) => {
  const platformCode = userinfo.platformCode;
  return (
    <div className="container margin">
      <UserInfoContainer user={userinfo.avatar}>
        <div className="row nomargin">
          <div className="col-6 left">
            <div className="avatar-name-container">
              <img src={userinfo.avatar} alt=""></img>
              <div className="platformicon-name-container">
                <div className="platform-icon-container">
                  {platformCode === 5
                    ? svgs.pc
                    : platformCode === 1
                    ? svgs.xbox
                    : platformCode === 2
                    ? svgs.ps4
                    : null}
                </div>
                <h1 className="player-name">{userinfo.name}</h1>{" "}
              </div>
            </div>
          </div>
          <div className="col-6 right">
            <img src={userinfo.iconUrl} alt=""></img>
          </div>
        </div>
      </UserInfoContainer>
    </div>
  );
};

export default UserInfoBlock;
