import React, { useState, useEffect } from "react";
import "./App.css";
import Background from "./components/Background";
import Error from "./components/Error";
import InputContainer from "./components/InputContainer";
import Input from "./components/Input";
import SearchButton from "./components/SearchButton";
import UserInfoBlock from "./components/UserInfoBlock";
import PlatformIcons from "./components/PlatformIcons";
import StatCard from "./components/StatCard";
import FavCard from "./components/FavCard";
import Separator from "./components/Seperator";
import { backgrounds, compare } from "./utils.js";
import { useSpring, animated } from "react-spring";

function App() {
  const myHeaders = new Headers();
  myHeaders.append("TRN-Api-Key", "05e6eb8f-3e95-4fbb-a2b5-b0f4dbb124c9");

  const [iconIndex, setIconIndex] = useState({
    active: 0,
    platformCode: null
  });

  const [loading, setLoading] = useState(false);
  const [platformCode, setplatformCode] = useState(null);
  const [bg, setBg] = useState(backgrounds.Pathfinder);
  const [data, setData] = useState();
  const [error, setError] = useState("0");
  const [display, setDisplay] = useState("none");
  const [darkness, setDarkness] = useState("170, 47, 43, 80%");
  const [count, setCount] = useState(0);

  const [legendStats, setlegendStats] = useState({
    name: "",
    iconUrl: "",
    avatar: ""
  });

  const [playerStats, setplayerStats] = useState([]);
  const [favStats, setFavStats] = useState([]);
  // console.log("players stats:", playerStats);
  const proxy_url = "https://fathomless-mesa-94824.herokuapp.com/";
  const apiUrlWithCode =
    "https://public-api.tracker.gg/v2/apex/standard/profile/" +
    platformCode +
    "/";

  const url = proxy_url + apiUrlWithCode;
  const icons = [
    <svg
      width="20"
      height="20"
      viewBox="0 0 26 26"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path
        fill="#CAD0E3"
        d="M5.733,2.183C5.72,2.193,5.71,2.204,5.698,2.214c0.073-0.077,0.178-0.16,0.247-0.205
    C7.959,0.7,10.286,0,12.868,0c2.415,0,4.677,0.667,6.608,1.827c0.14,0.083,0.522,0.345,0.719,0.583v0.001
    c-1.863-2.054-7.339,2.353-7.339,2.353c-1.894-1.46-3.636-2.455-4.933-2.809C6.839,1.658,6.089,1.906,5.733,2.183z M22.305,4.125
    c-0.057-0.063-0.119-0.122-0.176-0.187c-0.471-0.517-1.05-0.642-1.572-0.608c-0.475,0.149-2.67,0.94-5.375,3.494
    c0,0,3.045,2.961,4.91,5.988c1.863,3.027,2.977,5.406,2.292,8.708c2.079-2.285,3.347-5.321,3.347-8.655
    C25.731,9.491,24.432,6.42,22.305,4.125z M17.657,14.105c-0.826-0.927-2.055-2.255-3.678-3.869
    c-0.355-0.353-0.73-0.721-1.124-1.102c0,0-0.593,0.593-1.365,1.373v-0.001c-0.988,0.998-2.269,2.3-2.98,3.06
    c-1.266,1.351-4.893,5.594-5.097,7.973c0,0-0.807-1.887,0.964-6.239c1.157-2.845,4.653-7.117,6.113-8.509
    c0,0-1.334-1.468-3.008-2.482l-0.01-0.003c0,0-0.019-0.015-0.049-0.034c-0.805-0.48-1.684-0.85-2.53-0.899
    C4.029,3.434,3.482,4.066,3.482,4.066c-2.159,2.302-3.48,5.396-3.48,8.8c0,7.105,5.76,12.866,12.866,12.866
    c3.771,0,7.164-1.626,9.518-4.211c-0.001-0.004-0.271-1.7-2.002-4.133C19.977,16.818,18.49,15.039,17.657,14.105z"
      />
    </svg>,
    <svg
      width="20"
      height="20"
      viewBox="0 0 56.693 56.693"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <path
          fill="#CAD0E3"
          d="M3.765,46.362l19.836,2.873V30.257H3.765V46.362z M3.765,27.546h19.836V8.566L3.765,11.439V27.546z M26.312,49.628   l26.616,3.855V30.257H26.312V49.628z M26.312,8.172v19.374h26.616V4.319L26.312,8.172z"
        />
      </g>
    </svg>,
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path
        fill="#CAD0E3"
        d="M 10 3.5 L 10 21.84375 L 13.96875 23.0625 L 13.96875 7.75 C 13.96875 7.34375 14.019531 7.046875 14.1875 6.875 C 14.355469 6.640625 14.511719 6.617188 14.75 6.71875 C 15.324219 6.886719 15.59375 7.40625 15.59375 8.25 L 15.59375 14.40625 C 16.878906 15.015625 18.03125 15.078125 18.875 14.4375 C 19.753906 13.828125 20.21875 12.746094 20.21875 11.125 C 20.21875 9.433594 19.902344 8.128906 19.15625 7.28125 C 18.480469 6.371094 17.289063 5.640625 15.53125 5.03125 C 13.335938 4.320313 11.488281 3.8125 10 3.5 Z M 8.78125 14.59375 L 8 14.84375 L 3.09375 16.59375 L 2.25 16.9375 C 0.964844 17.476563 0.277344 18.054688 0.3125 18.5625 C 0.378906 19.304688 1.226563 19.84375 2.75 20.25 C 4.726563 20.78125 6.730469 20.902344 8.78125 20.59375 L 8.78125 18.5 L 8 18.78125 L 7.125 19.125 L 5.71875 19.40625 L 4.375 19.25 C 4.105469 19.078125 4.015625 18.886719 4.1875 18.71875 C 4.355469 18.617188 4.605469 18.476563 4.875 18.375 L 5.78125 18.0625 L 8.78125 17 Z M 20.15625 15.5625 C 19.789063 15.546875 19.417969 15.578125 19.0625 15.59375 C 17.75 15.621094 16.402344 15.835938 15 16.28125 L 15 18.75 L 17.78125 17.78125 L 19.21875 17.28125 C 19.21875 17.28125 19.761719 17.136719 20.15625 17.03125 C 20.761719 16.871094 21.40625 17.09375 21.40625 17.09375 C 21.777344 17.125 21.964844 17.265625 22.03125 17.4375 C 22.097656 17.640625 21.851563 17.796875 21.34375 17.96875 L 20.09375 18.46875 L 15 20.28125 L 15 22.6875 L 17.375 21.84375 L 23.09375 19.8125 L 23.78125 19.5 C 25.136719 18.992188 25.753906 18.457031 25.6875 17.78125 C 25.652344 17.136719 24.882813 16.628906 23.53125 16.1875 C 22.390625 15.804688 21.253906 15.605469 20.15625 15.5625 Z"
      />
    </svg>
  ];

  function getData(captureValue) {
    setLoading(true);
    fetch(url + captureValue, {
      method: "GET",
      headers: myHeaders
    })
      .then(function(res) {
        return res.json();
      })
      .then(function(resJson) {
        const filterSeasonWins = resJson.data.segments.map(x => x);
        const filterUndefined = filterSeasonWins.filter(
          x => x.stats.kills !== undefined
        );

        const sortedByKills = filterUndefined.sort(compare);

        const prefix = resJson.data.segments[0];
        console.log("Prefix:", sortedByKills);
        // console.log(prefix.stats.level.value);

        let stats = [];

        for (let prop in prefix.stats) {
          console.log("---", prop);

          let stat = prefix.stats[prop];

          if (typeof stat === "object" && stat.displayName) {
            let item = {
              // title: "?",
              subtitle: stat.displayName,
              stat: stat.value
            };
            stats.push(item);
          }
        }
        console.log('sorted by kills:', sortedByKills);
        // remove the "overall" stats object from the data and build favorites object
        const overviewRemoved = sortedByKills
          .filter(x => x.type !== "overview")
          .map(x => ({
            favName: x.metadata.name,
            favImage: x.metadata.imageUrl,
            killsDisplayName: x.stats.kills.displayName,
            killsDisplayValue: x.stats.kills.displayValue,
            seasonWinsDisplayName: x.stats.seasonWins.displayName,
            seasonWinsDisplayValue: x.stats.seasonWins.displayValue
          }));
        setFavStats(overviewRemoved);
        console.log("overview removed:", overviewRemoved);

        // console.log("---", stats);

        setplayerStats(stats);

        // console.log("Player Stats:", playerStats);

        setlegendStats({
          name: resJson.data.platformInfo.platformUserHandle,
          iconUrl: resJson.data.segments[0].stats.rankScore.metadata.iconUrl,
          avatar: resJson.data.platformInfo.avatarUrl,
          platformCode: platformCode
        });
        setError("0");
        setData(resJson.data);
        setDisplay("block");
        // console.log(sortedByKills[1].metadata.name);
        const legendName = sortedByKills[1].metadata.name;

        const bgSwitch = state => {
          switch (state) {
            case "Pathfinder":
              return backgrounds.Pathfinder;
            case "Bangalore":
              return backgrounds.bangalore;
            case "Bloodhound":
              return backgrounds.bloodhound;
            case "Wraith":
              return backgrounds.wraith;
            case "Wattson":
              return backgrounds.wattson;
            case "Caustic":
              return backgrounds.caustic;
            case "Mirage":
              return backgrounds.mirage;
            case "Lifeline":
              return backgrounds.lifeline;
            case "Gibraltar":
              return backgrounds.gibraltar;
            default:
              return null;
          }
        };
        // console.log(bgSwitch(legendName));
        setBg(bgSwitch(legendName));
        setLoading(false);
      })
      .catch(function() {
        console.log("error");
        setError("1");
        setLoading(false);
      });
  }

  // useEffect(() => {
  //   getData();
  // }, []);

  const captureValue = e => {
    if (e.keyCode === 13) {
      getData(window.input_search.value);
    }
  };

  const captureValue2 = () => {
    getData(window.input_search.value);
  };

  const darkenBackground = () => setDarkness("226,59,46, 100%");
  const lightenBackground = () => setDarkness("170, 47, 43, 80%");

  const selectIcon = index => {
    setCount(count + 1);
    // console.log(count);
    setIconIndex({
      active: index
    });
    // console.log("index:", index);
    index === 1
      ? setplatformCode(5)
      : index === 0
      ? setplatformCode(1)
      : index === 2
      ? setplatformCode(2)
      : console.log(iconIndex.active);
  };

  const props = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(-50px)" }
  });

  return (
    <Background bgData={bg}>
      <div className="container">
        <div className="row">
          <InputContainer darkness={darkness}>
            <animated.div className="search_wrapper" style={props}>
              <div className="col-sm-4 no-padding">
                <p>CHECK PLAYER RANK AND STATS</p>
              </div>
              <div className="col-sm-6 no-padding">
                <Input>
                  <div className="container">
                    <div className="row">
                      <div className="col-sm-2 no-padding svg-wrapper">
                        {icons.map((x, index) => (
                          <div
                            className={
                              iconIndex.active === index
                                ? "icon-container active"
                                : "icon-container"
                            }
                            onClick={() => selectIcon(index)}
                            key={index}
                          >
                            <PlatformIcons count={x} data={index} />
                          </div>
                        ))}
                      </div>
                      <div className="col-sm-10 no-padding">
                        <input
                          type="text"
                          placeholder="Apex Username"
                          onKeyDown={captureValue}
                          onFocus={darkenBackground}
                          onBlur={lightenBackground}
                          id="input_search"
                        ></input>
                      </div>
                    </div>
                  </div>
                </Input>
              </div>
              <div className="col-sm-2">
                <SearchButton
                  loadingState={loading}
                  isClicked={captureValue2}
                ></SearchButton>
              </div>
            </animated.div>
          </InputContainer>
          <Error toggleDisplay={error}>
            <p>
              Sorry. Player nickname does not exist. Please check the nickname,
              platform and try again.
            </p>
          </Error>

          <UserInfoBlock
            userinfo={legendStats}
            toggleDisplay={error}
          ></UserInfoBlock>
        </div>
        <Separator toggleDisplay={display}>
          <div className="row segway">
            <div className="col-sm-12 background">
              <h2>Stats Overview</h2>
            </div>
          </div>
        </Separator>
        <div className="row margin-sm">
          {playerStats.map((x, index) => (
            <StatCard key={index} stats={x}></StatCard>
          ))}
        </div>
        <Separator toggleDisplay={display}>
          <div className="row segway">
            <div className="col-sm-12 background-dark">
              <h3>Favorite Legends</h3>
            </div>
          </div>
        </Separator>
        <div className="row segway margin-sm background-dark">
          {favStats.map((x, index) =>
            index <= 1 ? <FavCard key={index} favstats={x}></FavCard> : ""
          )}
        </div>
      </div>
    </Background>
  );
}

export default App;
