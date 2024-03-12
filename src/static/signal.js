document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signalBtn').addEventListener('click', function() {
        fetch('homepage', {
            method: 'POST',
            body: new FormData(document.querySelector('form'))
        })
        .then(response => response.json())
        .then(data => {
            const labels = data.signal_strength_data.map(item => {
                const date = new Date(item.time);
                // Nastavit časovou zónu na UTC
                date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000); // Přepočítá na lokální čas
                // leading zero
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`;
            });      
            const latencyData = data.signal_strength_data.map(item => item.latency * 100);
            const intervalData = data.signal_strength_data.map(item => item.interval * 100);
            const signalStrengthData = data.signal_strength_data.map(item => item.signal_strength);
            const numSatellitesData = data.signal_strength_data.map(item => item.num_satellites);
            const signalQualityData = data.signal_strength_data.map(item => item.signal_quality);
            const noiseRatioData = data.signal_strength_data.map(item => item.noise_ratio);

            // graph config
            const dataset = [
                {
                    label: 'Latency (*100)',
                    data: latencyData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Server Data Interval (*100)',
                    data: intervalData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Signal Strength (RSRP)',
                    data: signalStrengthData,
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Num. of Satellites',
                    data: numSatellitesData,
                    borderColor: 'rgba(34, 139, 34, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Signal Quality (RSRQ)',
                    data: signalQualityData,
                    borderColor: 'rgba(128, 0, 128, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Noise Ratio (SNR)',
                    data: noiseRatioData,
                    borderColor: 'rgba(0, 0, 0, 1)',
                    borderWidth: 1
                }
            ];

            let signalGraphCanvas = document.getElementById('signalGraph').querySelector('canvas');
            if (!signalGraphCanvas) {
                signalGraphCanvas = document.createElement('canvas');
                document.getElementById('signalGraph').appendChild(signalGraphCanvas);
            }

            const ctx = document.getElementById('signalGraph').querySelector('canvas').getContext('2d');

            chartInstances['signalGraph'] = new Chart(ctx, {
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