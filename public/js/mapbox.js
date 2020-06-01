

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25icmV6ZWwiLCJhIjoiY2pwNXNyb3IxMDJwZTNxbzZ4M3IxdGp5ZCJ9.1_DVjqU_cgiK9gt-LGf3DA';


$(document).ready(function(){ //call when the document is loaded
    console.log("Ready!")
    var map = new mapboxgl.Map({
        container: 'mapBox',
        style: 'mapbox://styles/aaronbrezel/ckawuj5n200b71io1wjxynuji'
      });
      
})