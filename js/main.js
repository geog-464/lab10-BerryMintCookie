// declare the map variable here to give it a global scope
let myMap;
let mapStyle;

// we might as well declare our baselayer(s) here too
const CartoDB_Positron = L.tileLayer(
	'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', 
	{
		attribution: '&copy; <a href = "https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}
)
var OpenStreetMap_Mapnik = L.tileLayer (
	'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
	{
		attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}
)
var OpenStreetMap_HOT = L.tileLayer(
	'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
	{
	attribution: '&copy; <a href = "https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors, Tiles style by <a href = "https://www.hotosm.org/" target = "_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href = "https://openstreetmap.fr/" target = "_blank">OpenStreetMap France</a>'
	}
)


function initialize(){
    loadMap();
};

function loadMap(mapid){
	try {
		myMap.remove()
	} catch(e) {
		console.log(e)
		console.log("no map to delete")
	} finally {
		if (mapid == 'mapa') {
			mapStyle = "a";
		
		myMap = L.map('mapdiv', {
			center: [45.50, -73.58],
			zoom: 2.5,
			mazZoom: 18,
			minZoom: 2,
			layers: CartoDB_Positron
		});

		let baseLayers = {
			"CartoDB": CartoDB_Positron,
			"OPS_Mapnik": OpenStreetMap_Mapnik,
			"OPS_HOT": OpenStreetMap_HOT
		};
		
		let lcontrol = L.control.layers(baseLayers);
		lcontrol.addTo(myMap);
		
		fetchData();
		
		}
		
		if (mapid == 'mapb') {
			mapStyle = "b";
			
			myMap = L.map('mapdiv', {
				center: [45.50, -73.58],
				zoom: 2.5,
				mazZoom: 18,
				minZoom: 2,
				layers: OpenStreetMap_HOT
		});
		
		let baseLayers = {
			"CartoDB": CartoDB_Positron,
			"OPS_Mapnik": OpenStreetMap_Mapnik,
			"OPS_HOT": OpenStreetMap_HOT
		};
		
		let lcontrol = L.control.layers(baseLayers);
		lcontrol.addTo(myMap);
		fetchData();
		}
	}
	console.log(mapStyle)
	console.log(mapid)
};

function fetchData(){
    //load the data
	if (mapStyle == 'a') {
		fetch('https://raw.githubusercontent.com/geog-464/lab10/main/data/megacities.geojson')
			.then(function(response){
				return response.json();
			}) 	
			.then(function(json){
				L.geoJson(json,{style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);
			})
	};

	if (mapStyle == 'b') {
		fetch('https://raw.githubusercontent.com/geog-464/lab10/main/data/Amtrak_Stations.geojson')
			.then(function(response){
				return response.json();
			}) 	
			.then(function(json){
				L.geoJson(json,{style: styleAll, pointToLayer: generateCircles, onEachFeature: addPopups}).addTo(myMap);
			})
		}
};

function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
}

function styleAll(feature, latlng) {	
	if (mapStyle == 'a') {
		console.log(feature.properties.ZipCode)
		var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0};
		
		if (feature.geometry.type == "Point") {
			styles.fillColor = 'red'
			,styles.fillOpacity = 0.7
			,styles.stroke = true
			,styles.radius = 8
			}
		return styles;
	}
	
	if (mapStyle == 'b') {
		console.log(feature.properties.ZipCode)
		var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0};
		
		if (feature.geometry.type == "Point") {
			styles.fillColor = 'grey'
			,styles.fillOpacity = 0.5
			,styles.stroke = true
			,styles.radius = 5
			}
		if (typeof feature.properties.ZipCode == 'string') {
			styles.fillColor = 'cyan'
			,styles.fillOpacity = 0.5
			,styles.stroke = true
			,styles.radius = 5
			}
		return styles;
	}
}

function addPopups(feature, layer) {
	if (mapStyle == 'a') {
		layer.bindPopup(feature.properties.city);
	}
	if (mapStyle == 'b') {
		layer.bindPopup(feature.properties.ZipCode + ", " + feature.properties.City + ", " + feature.properties.State);
	}
}


//window.onload = initialize();