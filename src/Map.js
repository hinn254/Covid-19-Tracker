import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "./util";
const Map = ({ center, countries, casesType, zoom }) => {
  return (
    <div className="map">
      {/* Shows nothing so import leaflet.css in App */}
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Loop thru countries and draw circles on screen*/}
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
};

export default Map;
