import React, { useEffect, useState } from "react";
import "./App.css";
import Background from "./components/Background";
import Error from "./components/Error";
import Pathfinder from "./images/pathfinder.jpg";

function App() {
  const myHeaders = new Headers();
  myHeaders.append("TRN-Api-Key", "05e6eb8f-3e95-4fbb-a2b5-b0f4dbb124c9");

  const proxy_url = "https://fathomless-mesa-94824.herokuapp.com/";
  const url = "https://public-api.tracker.gg/v2/apex/standard/profile/5";
  const [bg, setBg] = useState(Pathfinder);
  const [data, setData] = useState();
  const [error, setError] = useState("none");

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
        // filterUndefined.map(x => console.log(x));

        const sortedByKills = filterUndefined.sort(compare);

        console.log(sortedByKills[1].metadata.bgImageUrl);
        setError("none");
        setData(resJson.data);
        setBg(sortedByKills[1].metadata.bgImageUrl);
      }).catch(function() {
        console.log("error");
        setError("block");
    });;
  }

  // useEffect(() => {
  //   getData();
  // }, []);

  const captureValue = e => {
    if (e.key === "Enter") {
      getData(e.target.value);
    }
  };



  return (
    <Background bgData={bg}>
      <p>FIND YOUR APEX LEGENDS STATS</p>
      <input
        type="text"
        placeholder="Search For Profile..."
        onKeyDown={captureValue}
      ></input>
      <Error toggleDisplay={error}>
        <p>Sorry. Player nickname does not exist. Please check the nickname, platform and try again.</p>
      </Error>
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
