// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
console.log(queryUrl)

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    // Once we get a response, create a geoJSON layer containing the features array and add a popup for each marker
    // then, send the layer to the createMap() function.
    var earthquakes = L.geoJSON(data.features, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, getMarkerOptions(feature));
        },
        onEachFeature: addPopup
    });
    createMap(earthquakes);
});

function getMarkerOptions(feature) {
    var geojsonMarkerOptions = {
        radius: feature.properties.mag,
        // radius: 8,
        fillColor: "#FF3E00",
        color: "#000",
        weight: 1,
        opacity: 1,
        // set opacity 
        fillOpacity: feature.geometry.coordinates[2] * 0.1
    };
    return geojsonMarkerOptions;
}

// Define a function we want to run once for each feature in the features array
function addPopup(feature, layer) {
    // Give each feature a popup describing the place and time of the earthquake
    return layer.bindPopup(`<h3> Location: ${feature.properties.place} </h3> <hr> 
                            <p> Date & Time: ${Date(feature.properties.time)} </p>
                            <p> Type: ${feature.properties.type} </p>
                            <p> Magnitude: ${feature.geometry.coordinates[2]}`);
}

// function to receive a layer of markers and plot them on a map.
function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        maxZoom: 5,
        id: "streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        maxZoom: 5,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes

    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("mapid", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [darkmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);








}