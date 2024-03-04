document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('mapBtn').addEventListener('click', function() {
        fetch('homepage', {
            method: 'POST',
            body: new FormData(document.querySelector('form'))
        })
        .then(response => response.json())
        .then(data => {
            createMap(data.longitude_latitude_data);
        })
        .catch(error => {
            console.error('Error when loading data:', error);
        });
    });
});

function createMap(data){
    if (data && data.length > 0 && data[0].longitude && data[0].latitude) {
        const map = new ol.Map({
            target: 'mapGraph',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM({
                        attributions: []
                    })
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([data[0].longitude, data[0].latitude]),
                zoom: 16,
                maxZoom: 20
            })
        });
        
        const features = data.map(entry => {
            const point = ol.proj.fromLonLat([entry.longitude, entry.latitude]);
            const feature = new ol.Feature({
                geometry: new ol.geom.Point(point),
                time: entry.time
            });
            return feature;
        });
        
        const source = new ol.source.Vector({
            features: features
        });
        
        const layer = new ol.layer.Vector({
            source: source,
            style: function(feature) {
                if (feature === selectedFeature) {
                    return new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 6,
                            fill: new ol.style.Fill({ color: 'red' }),  // if selected => red
                            stroke: new ol.style.Stroke({ color: 'black', width: 1 })
                        })
                    });
                } else {
                    return new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 4,
                            stroke: new ol.style.Stroke({ color: 'blue', width: 1 }), // default blue
                        })
                    });
                }
            }
        });
        
        map.addLayer(layer);
        
        let selectedFeature = null;


        // init slider container
        const timeSliderContainer = document.createElement('div');
        timeSliderContainer.id = 'slider-container';
        timeSliderContainer.className = 'graph';
        // init slider
        const timeSlider = document.createElement('input');
        timeSlider.type = 'range';
        timeSlider.min = 0;
        timeSlider.max = data.length - 1;
        timeSlider.step = 1;
        timeSlider.value = 0;
        timeSlider.id = 'time-slider';
        
        // start time
        const startLabel = document.createElement('span');
        startLabel.id = 'start-label';
        startLabel.textContent = new Date(data[0].time).toLocaleString();
        
        // end time
        const endLabel = document.createElement('span');
        endLabel.className = 'end-label';
        endLabel.textContent = new Date(data[data.length - 1].time).toLocaleString();
        
        // init labels container
        const timeLabelsContainer = document.createElement('div');
        timeLabelsContainer.id = 'label-container';
        timeLabelsContainer.className = 'graph';
        
        // appending to containers
        timeSliderContainer.appendChild(timeSlider);
        timeLabelsContainer.appendChild(startLabel);
        timeLabelsContainer.appendChild(endLabel);
        
        const mapGraph = document.getElementById('mapGraph');
        // inserting slider container
        mapGraph.parentNode.insertBefore(timeSliderContainer, mapGraph.nextSibling); // under map
        // inserting labels container
        timeSliderContainer.parentNode.insertBefore(timeLabelsContainer, timeSliderContainer.nextSibling); // under timeslider
        
        // when resizing
        window.addEventListener('resize', function() {
            timeSlider.style.width = timeSliderContainer.offsetWidth + 'px';
            timeLabelsContainer.style.width = timeSlider.offsetWidth + 'px';
        });
        
        // default values
        timeSlider.style.width = timeSliderContainer.offsetWidth + 'px';
        timeLabelsContainer.style.width = timeSlider.offsetWidth + 'px';
        
        // last date digit under the end of slider
        endLabel.style.position = 'absolute';
        endLabel.style.right = endLabel.offsetWidth + 'px';

        const currentDateBubble = document.createElement('div');
        currentDateBubble.className = 'current-date-bubble';
        timeSliderContainer.appendChild(currentDateBubble);
        currentDateBubble.style.display = 'none'; // invisible until slider changed

        timeSlider.addEventListener('input', function() {
            currentDateBubble.style.display = 'block';
            const index = parseInt(this.value);
            const coordinates = [data[index].longitude, data[index].latitude];
            const point = ol.proj.fromLonLat(coordinates);
            map.getView().setCenter(point);
            
            const currentDate = new Date(data[index].time).toLocaleString();
            
            currentDateBubble.textContent = currentDate;

            selectedFeature = features[index];
            layer.changed(); // updating layers
        });
    }
}