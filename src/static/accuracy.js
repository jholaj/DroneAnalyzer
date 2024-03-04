document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('accuracyBtn').addEventListener('click', function() {
        fetch('homepage', {
            method: 'POST',
            body: new FormData(document.querySelector('form'))
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const labels = data.accuracy_data.map(item => item.time);
            const horizontalAccuracyData = data.accuracy_data.map(item => item.horizontal_accuracy);
            const verticalAccuracyData = data.accuracy_data.map(item => item.vertical_accuracy);
            const speedAccuracyData = data.accuracy_data.map(item => item.speed_accuracy);

            console.log(labels);
            console.log(horizontalAccuracyData);
            console.log(verticalAccuracyData);
            console.log(speedAccuracyData);

            // Konfigurace datové sady pro graf
            const dataset = [
                {
                    label: 'Horizontal Accuracy',
                    data: horizontalAccuracyData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Vertical Accuracy',
                    data: verticalAccuracyData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Speed Accuracy',
                    data: speedAccuracyData,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }
            ];

            // Vytvoření grafu
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
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error when loading data:', error);
        });
    });
});