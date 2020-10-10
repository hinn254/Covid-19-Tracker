import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import "./App.css";
import { sortData, prettyPrintStat } from "./util";
import "leaflet/dist/leaflet.css";

// @material-us/core
// react-leaflet  (The Map)
// leaflet        (Also the Map)
// react-chartjs-2 chart.js   (graph chart chartjs)
// numeral  (for formating numbers.. (currency, percentages, decimal places))

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796,
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  // fecthing worlwide data
  useEffect(() => {
    const GlobalData = async () => {
      const response = await fetch("https://disease.sh/v3/covid-19/all");
      const data = await response.json();
      setCountryInfo(data);
    };
    GlobalData();
  }, []);

  useEffect(() => {
    const fetchCountriesData = async () => {
      const response = await fetch("https://disease.sh/v3/covid-19/countries");
      const data = await response.json();
      let countries = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }));

      const sortedData = sortData(data);
      setTableData(sortedData);
      setMapCountries(data);
      setCountries(countries);
    };
    fetchCountriesData();
  }, []);

  // when changes we make a call to api to get its data
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/{countrycode}

    const response = await fetch(url);
    const data = await response.json();
    // all the data from a country response
    setCountry(countryCode);

    setCountryInfo(data);

    // for changing map center and zoom
    setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
    setMapZoom(4);
  };
  console.log("county info", countryInfo);
  return (
    <div className="app">
      <div className="app__left">
        {/* Haeder */}
        {/* title + select input dropdown */}
        <div className="app__header">
          <h1>Covide 19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              varaint="outlined"
              onChange={onCountryChange}
              value={country}
            >
              {/* loop thru all countries and show a drop down */}
              <MenuItem value="worldwide">Worldwide</MenuItem>

              {countries.map((country, i) => (
                <MenuItem key={i} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/* Info boxes cases */}
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coranavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />

          {/* Info boxes  recoveries*/}
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />

          {/* Info boxes */}
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        {/* Map */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by countries</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">World Wide new {casesType}</h3>
          {/* Graph */}
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
