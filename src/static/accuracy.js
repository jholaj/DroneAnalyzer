document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('accuracyBtn').addEventListener('click', function() {
        fetch('homepage', {
            method: 'POST',
            body: new FormData(document.querySelector('form'))
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const labels = data.accuracy_data.map(item => {
                const date = new Date(item.time);
                // leading zero
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`;
            });            
            const horizontalAccuracyData = data.accuracy_data.map(item => item.horizontal_accuracy);
            const verticalAccuracyData = data.accuracy_data.map(item => item.vertical_accuracy);
            const speedAccuracyData = data.accuracy_data.map(item => item.speed_accuracy);

            console.log(labels);
            console.log(horizontalAccuracyData);
            console.log(verticalAccuracyData);
            console.log(speedAccuracyData);

            // graph config
            const dataset = [
                {
                    label: 'Horizontal Accuracy (m)',
                    data: horizontalAccuracyData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Vertical Accuracy (m)',
                    data: verticalAccuracyData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Speed Accuracy (m)',
                    data: speedAccuracyData,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }
            ];

            let accuracyGraphCanvas = document.getElementById('accuracyGraph').querySelector('canvas');
            if (!accuracyGraphCanvas) {
                accuracyGraphCanvas = document.createElement('canvas');
                document.getElementById('accuracyGraph').appendChild(accuracyGraphCanvas);
            }

            const ctx = document.getElementById('accuracyGraph').querySelector('canvas').getContext('2d');


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