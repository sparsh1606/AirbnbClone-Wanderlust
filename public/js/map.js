
const API_KEY = mapToken;
// Initialize the map
const map = L.map("map",{scrollWheelZoom: false}).setView([28.6139, 77.209], 10); // Example: Delhi coords

// Add MapTiler tile layer
L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${API_KEY}`,{
    attribution:'&copy; <a href="https://www.maptiler.com/">MapTiler</a> contributors',
    tileSize: 512,
    zoomOffset: -1,
  }).addTo(map);
console.log(coordinates);
// L.marker([28.6139, 77.209]).addTo(map)
//   .bindPopup('A pretty CSS popup.<br> Easily customizable.')
//   .openPopup();

marker = L.marker([coordinates[1], coordinates[0]]).addTo(map)
            .bindPopup(`<b>Exact location will be provided after booking</b>`)
            .openPopup();

map.setView([coordinates[1], coordinates[0]], 10);