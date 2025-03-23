import type { NextPage } from "next";
import { useRef } from "react";
import Map, { Layer, MapRef, Marker, Source } from "react-map-gl/maplibre";
import { useEffect, useState } from 'react';

// const locations = [
//   {
//     latitude: 1.3614206826,
//     longitude: 103.8430844601,
//     name: "BLK 246-256 BISHAN STREET 22",
//   },
//   {
//     latitude: 1.3609610362,
//     longitude: 103.8436216081,
//     name: "BLK 246A BISHAN STREET 22",
//   },
// ];

const IndexPage: NextPage = () => {
  const [locations, setLocations] = useState([{
    latitude: 1.3614206826,
    longitude: 103.8430844601,
    name: "BLK 246-256 BISHAN STREET 22",
  },
  {
    latitude: 1.3609610362,
    longitude: 103.8436216081,
    name: "BLK 246A BISHAN STREET 22",
  }]);
  const [value, setValue] = useState("");

  // 200640
  // 461431
  const handleChange = (e) => {
    setValue(e.target.value);
  }

  const mapRef = useRef<MapRef>(null);

  const flyTo = (coordinates: [number, number]): void => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    map.flyTo({
      center: coordinates,
      essential: true,
      zoom: 14,
    });
  };

  useEffect(() => {
    fetch('http://localhost:5000/recommendations', {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "postal_code": parseInt(value) }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLocations(data);
      });
  }, [value]);

  return (
    <>
      <input value={value} onChange={handleChange} />
      <Map
        ref={mapRef}
        maxBounds={[103.596, 1.1443, 104.1, 1.4835]}
        mapStyle="https://www.onemap.gov.sg/maps/json/raster/mbstyle/Grey.json"
        style={{
          width: "90vw",
          height: "90vh",
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.name}
            latitude={location.latitude}
            longitude={location.longitude}
          >
            <div
              className="mrt-marker"
              onClick={() => flyTo([location.longitude, location.latitude])}
            >
              {location.name}
              <style jsx>{`
              .mrt-marker {
                background: red;
                color: white;
                padding: 4px;
              }
            `}</style>
            </div>
          </Marker>
        ))}
      </Map>
    </>
  );
};

export default IndexPage;