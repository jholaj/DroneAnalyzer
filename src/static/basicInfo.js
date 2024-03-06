document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loadBtn').addEventListener('click', function() {
        fetch('homepage', {
            method: 'POST',
            body: new FormData(document.querySelector('form'))
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const labels = data.basic_data.map(item => {
                const date = new Date(item.time);
                // leading zero
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`;
            });   

            const altitudeData = data.basic_data.map(item => item.altitude);
            const geoAltitudeData = data.basic_data.map(item => item.geo_altitude);
            const heightData = data.basic_data.map(item => item.height);
            //const pressureData = data.basic_data.map(item => item.pressure);
            
            // create selector for: 

                // Altitude
                // Velocity
                // Battery
                // Pressure

            // graph config
            const dataset = [
                {
                    label: 'Altitude',
                    data: altitudeData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Geo Altitude',
                    data: geoAltitudeData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Height',
                    data: heightData,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                },
            ];

            let basicGraphCanvas = document.getElementById('basicGraph').querySelector('canvas');
            if (!basicGraphCanvas) {
                basicGraphCanvas = document.createElement('canvas');
                document.getElementById('basicGraph').appendChild(basicGraphCanvas);
            }

            const ctx = document.getElementById('basicGraph').querySelector('canvas').getContext('2d');

            const myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: dataset
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        zoom: {
                            pan: {
                                enabled: true,
                                modifierKey: 'ctrl',
                            },
                            zoom: {
                                drag: {
                                enabled: true
                                },
                                mode: 'x',
                            },
                        }
                }
                },
            });
        })
        .catch(error => {
            console.error('Error when loading data:', error);
        });
    });
});