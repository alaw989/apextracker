import React, { useEffect, useState } from "react";
import "./App.css";
import Background from "./components/Background";
import Error from "./components/Error";
import InputContainer from "./components/InputContainer";
import Input from "./components/Input";
import PlaystationSVG from "./components/PlaystationSVG";
import WindowsSVG from "./components/WindowsSVG";
import XboxSVG from "./components/XboxSVG";
import Pathfinder from "./images/pathfinder.jpg";

function App() {
  const myHeaders = new Headers();
  myHeaders.append("TRN-Api-Key", "05e6eb8f-3e95-4fbb-a2b5-b0f4dbb124c9");

  const proxy_url = "https://fathomless-mesa-94824.herokuapp.com/";
  const url = "https://public-api.tracker.gg/v2/apex/standard/profile/5";
  const [bg, setBg] = useState(Pathfinder);
  const [data, setData] = useState();
  const [error, setError] = useState("none");
  const [darkness, setDarkness] = useState("170, 47, 43, 80%");
  const [iconDark, setIconDark] = useState("#CAD0E3");

  function getData(captureValue) {
    console.log(captureValue);
    fetch(proxy_url + url + "/" + captureValue, {
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

        filterUndefined.map(x => console.log(x));

        const sortedByKills = filterUndefined.sort(compare);

        console.log(sortedByKills[1].metadata.bgImageUrl);
        setError("none");
        setData(resJson.data);
        setBg(sortedByKills[1].metadata.bgImageUrl);
      })
      .catch(function() {
        console.log("error");
        setError("block");
      });
  }

  // useEffect(() => {
  //   getData();
  // }, []);

  const captureValue = e => {
    if (e.key === "Enter") {
      getData(e.target.value);
    }
  };

  const darkenBackground = () => {
    setDarkness("226,59,46, 100%");
  };

  const lightenBackground = () => {
    setDarkness("170, 47, 43, 80%");
  };

  const darkenIcon = () => {
    setIconDark("#98A0BA");
  };

  const lightenIcon = () => {
    setIconDark("#CAD0E3");
  }

  return (
    <Background bgData={bg}>
      <div className="container">
        <div className="row">
          <InputContainer darkness={darkness}>
            <div className="search_wrapper">
              <div className="col-sm-4 no-padding">
                <p>CHECK PLAYER RANK AND STATS</p>
              </div>
              <div className="col-sm-6 no-padding">
                <Input>
                  <div className="container">
                    <div className="row">
                      <div className="col-sm-2 no-padding svg-wrapper">
                        <div className="icon-container" >
                          <WindowsSVG fill={iconDark}></WindowsSVG>
                        </div>
                        <div className="icon-container" >
                          <PlaystationSVG fill={iconDark}></PlaystationSVG>
                        </div>
                        <div className="icon-container" >
                          <XboxSVG fill={iconDark}></XboxSVG>
                        </div>
                      </div>
                      <div className="col-sm-10 no-padding">
                        <input
                          type="text"
                          placeholder="Apex Username"
                          onKeyDown={captureValue}
                          onFocus={darkenBackground}
                          onBlur={lightenBackground}
                        ></input>
                      </div>
                    </div>
                  </div>
                </Input>
              </div>
              <div className="col-sm-2">
                <button>Search</button>
              </div>
            </div>
          </InputContainer>
          <Error toggleDisplay={error}>
            <p>
              Sorry. Player nickname does not exist. Please check the nickname,
              platform and try again.
            </p>
          </Error>
        </div>
      </div>
    </Background>
  );
}

export default App;

const compare = (a, b) => {
  const killsA = Number(a.stats.kills.value);
  const killsB = Number(b.stats.kills.value);

  var comparison = 0;
  if (killsA < killsB) {
    comparison = 1;
  } else if (killsA > killsB) {
    comparison = -1;
  }

  return comparison;
};
