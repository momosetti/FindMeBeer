import React from "react";
import { useState, useCallback } from "react";
import "rsuite/dist/styles/rsuite-default.css";
import { Alert } from "rsuite";
function App() {
  const [locData, setLocData] = useState("Podunk");
  const [brewData, setBrewData] = useState([]);

  const onLocChange = useCallback((event) => {
    console.log(event.target.value);
    setLocData(event.target.value);
  }, []);

  const formSubmitted = useCallback(
    (event) => {
      event.preventDefault();
      console.log("Form was submitted!");
      console.log(locData);
      getBreweries(locData);
    },
    [locData]
  );

  const clearOnInputClick = () => {
    setLocData("");
  };

  function getBreweries(location) {
    const transformedLocation = location.split(" ").join("_");
    fetchBrew();
    async function fetchBrew() {
      const res = await fetch(
        `https://api.openbrewerydb.org/breweries?by_city=${transformedLocation}`
      );
      const data = await res.json();
      setBrewData(data);
      console.log(data);

      if (data.length === 0) {
        Alert.error("Sorry, no result for your location.", 5000);
      }
    }
  }

  // return ( "Sorry we could not find any results for that location." );

  return (
    <div>
      <div class="header">
        <h1>Find Me Beer!</h1>
      </div>
      Returns a list of breweries in a given city.
      <br></br>
      <br></br>
      <form onSubmit={formSubmitted}>
        <label>Enter a city:</label>
        <input
          value={locData}
          onChange={onLocChange}
          onClick={clearOnInputClick}
        />
        <button>GO</button>
      </form>
      <div class="list">
        {brewData.map((brewery) => (
          <div key={brewery.id} class="card">
            <h4>{brewery.name}</h4>
            <div class="container">
              {brewery.street}
              <br></br>
              {brewery.city}, {brewery.state} {brewery.postal_code}
              <br></br>
              {brewery.website_url.length > 0 && (
                <a href={brewery.website_url}>Website</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
