import React, { useState, useEffect } from "react";
import "./App.css";
import Background from "./components/Background";
import Error from "./components/Error";
import InputContainer from "./components/InputContainer";
import Input from "./components/Input";
import SearchButton from "./components/SearchButton";
import UserInfoBlock from "./components/UserInfoBlock";
import PlatformIcons from "./components/PlatformIcons";
import AnimateAll from "./components/AnimateAll";
import StatCard from "./components/StatCard";
import FavCard from "./components/FavCard";
import Separator from "./components/Seperator";
import { backgrounds, compare, icons, bgSwitch } from "./utils.js";
import { useSpring, animated } from "react-spring";

function App() {
  const myHeaders = new Headers();
  myHeaders.append("TRN-Api-Key", "05e6eb8f-3e95-4fbb-a2b5-b0f4dbb124c9");

  const [iconIndex, setIconIndex] = useState({
    active: 0,
    platformCode: null
  });

  const [animate, setAnimate] = useState(true);
  const [animateCount, setAnimateCount] = useState(0);

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
  const proxy_url = "https://fathomless-mesa-94824.herokuapp.com/";
  const apiUrlWithCode =
    "https://public-api.tracker.gg/v2/apex/standard/profile/" +
    platformCode +
    "/";

  const url = proxy_url + apiUrlWithCode;

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

        let stats = [];

        for (let prop in prefix.stats) {
          let stat = prefix.stats[prop];
          if (typeof stat === "object" && stat.displayName) {
            let item = {
              subtitle: stat.displayName,
              stat: stat.value
            };
            stats.push(item);
          }
        }

        // remove the "overall" stats object from the data and build favorites object
        const overviewRemoved = sortedByKills.filter(
          x => x.type !== "overview"
        );

        setError("0");
        setData(resJson.data);
        setDisplay("block");
        const legendName = sortedByKills[1].metadata.name;
        setBg(bgSwitch(legendName));
        setLoading(false);

        setAnimateCount(animateCount + 1);
        console.log(animateCount);

        if (animateCount >= 1) {
          setAnimate(false);
          setTimeout(function() {
            setAnimate(true);
            setplayerStats(stats);
            setFavStats(overviewRemoved);
            setlegendStats({
              name: resJson.data.platformInfo.platformUserHandle,
              iconUrl:
                resJson.data.segments[0].stats.rankScore.metadata.iconUrl,
              avatar: resJson.data.platformInfo.avatarUrl,
              platformCode: platformCode
            });
          }, 1000);
        } else if (animateCount <= 1) {
          setplayerStats(stats);
          setFavStats(overviewRemoved);
          setlegendStats({
            name: resJson.data.platformInfo.platformUserHandle,
            iconUrl: resJson.data.segments[0].stats.rankScore.metadata.iconUrl,
            avatar: resJson.data.platformInfo.avatarUrl,
            platformCode: platformCode
          });
        }
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
          <AnimateAll rerenderAnimate={animate}>
            <UserInfoBlock
              userinfo={legendStats}
              toggleDisplay={error}
            ></UserInfoBlock>
          </AnimateAll>
        </div>
        <AnimateAll rerenderAnimate={animate}>
          <Separator toggleDisplay={display}>
            <div className="row segway">
              <div className="col-sm-12 background">
                <h2>Stats Overview</h2>
              </div>
            </div>
          </Separator>
        </AnimateAll>

        <AnimateAll rerenderAnimate={animate}>
          <div className="row margin-sm">
            {playerStats.map((x, index) => (
              <StatCard key={index} stats={x}></StatCard>
            ))}
          </div>
        </AnimateAll>

        <Separator toggleDisplay={display}>
          <div className="row segway">
            <div className="col-sm-12 background-dark">
              <h3>Favorite Legends</h3>
            </div>
          </div>
        </Separator>

        <AnimateAll rerenderAnimate={animate}>
          <div className="row segway margin-sm background-dark">
            {favStats.map((x, index) =>
              index <= 1 ? <FavCard key={index} favstats={x}></FavCard> : ""
            )}
          </div>
        </AnimateAll>
      </div>
    </Background>
  );
}

export default App;
