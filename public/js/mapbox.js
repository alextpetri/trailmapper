

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25icmV6ZWwiLCJhIjoiY2pwNXNyb3IxMDJwZTNxbzZ4M3IxdGp5ZCJ9.1_DVjqU_cgiK9gt-LGf3DA';


//TODO: Do we need a seperate trailNodes object for existing nodes/hiking trips?
// We could simply load trailNodes as an empty map.addSource and add nodes to this on click
// And if the user is loading an existing trail, we just prepopulate trailNodes before loading the map


//Could we actually store this geojson obj as a geojson file and simple load it in? 
var trailNodes = { //If loading an existing hiking trail, prepopulate this object with points from a source TBD
    "type": 'FeatureCollection',
    'features': [
        //EXAMPLE NODE
        // {
        //     'type': 'Feature',
        //     'geometry': {
        //     'type': 'Point',
        //     'coordinates': [0, 0]
        //     }
        // }

    ] 
};


var trailPath = { //Object to draw hiking trail between trail ndoes, gets added to trailNodes
    'type': 'Feature',
    'geometry': {
        'type': 'LineString',
        'coordinates': []
    }
};




$(document).ready(function(){ //call when the document is loaded
    console.log("Ready!")
    var map = new mapboxgl.Map({
        container: 'mapBox',
        style: 'mapbox://styles/aaronbrezel/ckawuj5n200b71io1wjxynuji',
        center: [-98.35, 39.50], // starting position at the geographic center of the united states
        zoom: 3.5 // starting zoom
    });

    map.on('load', function() { //Gotta wait until the map loads to do things to it
        addNodeAndPathLayers(map) //Add layers to map that will house hiking trail nodes and path
        setPin(map) //Add ability to add new nodes and paths
        cursorStyle(map)
    })
    

    


});

async function addNodeAndPathLayers(map){
    //https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addsource
    
    ////////////////////////////////////////////////////////////////////
    //TODO: Oppertunity to add await promise on loading existing data: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await
    ///////////////////////////////////////////////////////////////////
    map.addSource('trailJSON', { //Add trailNodes geojson data as a source to the map
        'type': 'geojson',
        'data': trailNodes
    });

    //https://docs.mapbox.com/mapbox-gl-js/api/map/#map#addlayer
    map.addLayer({ //Adds styling for trail Nodes
        id: 'trail-nodes', //Layer identifier
        type: 'circle', //Style the features in trailNodes as circles
        source: 'trailJSON', //References a source that's already been defined
        paint: { //Style the circles
            'circle-radius': 5,
            'circle-color': '#000'
        },
        filter: ['in', '$type', 'Point'] //The feature in trailJSON must be of type "Point"
    });

    map.addLayer({
        id: 'trail-paths',
        type: 'line', //Style the features in trail nodes as lines
        source: 'trailJSON',
        layout: { //How mapbox draws data
            'line-cap': 'round',
            'line-join': 'round'
        },
        paint: {
            'line-color': '#000',
            'line-width': 2.5
        },
        filter: ['in', '$type', 'LineString'] //The feature in trailJSON must be of type "LineString"
    });

    updateDistanceDiv();
};

function updateDistanceDiv(){
    var miles = turf.length(trailPath, {units: 'miles'}).toLocaleString() 
    var km = turf.length(trailPath, {units: 'kilometers'}).toLocaleString() 
    
    $("#distanceInMiles").text(miles + " miles")
    $("#distanceInKilometers").text(km + " km")
}



function setPin(map) {
    //Tutorial on recording mouseover coordinates available here https://docs.mapbox.com/mapbox-gl-js/example/mouse-position/
    //Markers documentation: https://docs.mapbox.com/mapbox-gl-js/api/markers/
   

    if(map.getZoom() >= 14){ //Zoom level fourteen is the current zoom at which hiking paths are visible. Should/Can we change this?

    }


    map.on('click', function(e) {
        // e.point is the x, y coordinates of the mousemove event relative to the top-left corner of the map
        // e.lngLat is the longitude, latitude geographical position of the event
        // console.log(e.lngLat.wrap());
        // console.log(map.getZoom())
        
        
        

        var features = map.queryRenderedFeatures(e.point, { //When you click, check if there is a trail node already existing at this point
            layers: ['trail-nodes']
        });

        // If we have more than one trail node, we will have a line string 
        // as the top feature. We want to remove this linestring feature. 
        // So we can recalculate a new linestring with the new point added
        if (trailNodes.features.length > 1) trailNodes.features.pop();
        
        // If a feature was clicked, remove it from the map
        if (features.length) {
            var id = features[0].properties.id;
            trailNodes.features = trailNodes.features.filter(function(point) {
                return point.properties.id !== id; //Return only the features that do not have the id of the clicked points
            });
        } else { //If no existing point was clicked, add new click as trail node
            var point = newPoint(e)        
            trailNodes.features.push(point);
        }

        if (trailNodes.features.length > 1) {
            trailPath.geometry.coordinates = trailNodes.features.map(function(point) {
                return point.geometry.coordinates;
            });
             
            trailNodes.features.push(trailPath);
             
            // Populate the distanceContainer with total distance
            // var value = document.createElement('pre');
            // value.textContent = 'Total distance: ' + turf.length(linestring).toLocaleString() + 'km';
            // distanceContainer.appendChild(value);
        }
             
        map.getSource('trailJSON').setData(trailNodes);
        updateDistanceDiv()    

        
    });
        
};

function cursorStyle(map) {
    map.on('mousemove', function(e) {
        var features = map.queryRenderedFeatures(e.point, {
        layers: ['trail-nodes']
        });
        // UI indicator for clicking/hovering a point on the map
        map.getCanvas().style.cursor = features.length
        ? 'pointer'
        : 'crosshair';
    });
};


//create a new point object on using the map click event
function newPoint(e){
    var newPoint = {
        'type': 'Feature',
        'geometry': {
            'type': 'Point',
            'coordinates': [e.lngLat.lng, e.lngLat.lat]
        },
        'properties': {
        'id': String(new Date().getTime()) //creates a unique id using datetime
        }
    };
    
    return newPoint

}
//Measure distances tutorial: https://docs.mapbox.com/mapbox-gl-js/example/measure/
//Tutorial fore clustering points (hikes) when zoomed out https://docs.mapbox.com/mapbox-gl-js/example/cluster/