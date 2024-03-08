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
            
            const batteryLabels = data.battery_data.map(item =>{
                const date = new Date(item.time);
                // leading zero
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`;
            });
            
            let selectedData = [];
            let selectedGraphDataLabels = [];
            let myChart;

            // Selector
            const selectList = document.createElement('select');
            selectList.style.textAlign = 'center';
            selectList.style.top = '50%';
            selectList.style.width = '40%';
            selectList.style.transform = 'translateX(72.5%)';
            selectList.style.marginBottom = '10px';
            
            // Change listener
            selectList.addEventListener('change', function() {
                const selectedDataset = this.value;
                const selectedData = data.basic_data.map(item => item[selectedDataset]);
                myChart.data.datasets[0].data = selectedData;
                myChart.update();
            });
            
            // Selector options
            const options = ['Altitude', 'Velocity', 'Pressure', 'Battery'];
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.toLowerCase().replace(/\s/g, '');
                optionElement.textContent = option;
                selectList.appendChild(optionElement);
            });

            // Insert selector before graph
            const graphContentElements = document.getElementsByClassName('graph-content');
            if (graphContentElements.length > 0) {
                const firstGraphContent = graphContentElements[0];
                firstGraphContent.parentNode.insertBefore(selectList, firstGraphContent);
            }    

            selectList.addEventListener('change', function() {
                const selectedOption = this.value;
                switch (selectedOption) {
                    case 'altitude':
                        selectedData = [
                            data.basic_data.map(item => item.altitude),
                            data.basic_data.map(item => item.geo_altitude),
                            data.basic_data.map(item => item.height)
                        ];
                        selectedGraphDataLabels = ['Altitude', 'Geo Altitude', 'Height'];
                        break;
                    case 'velocity':
                        selectedData = [
                            data.basic_data.map(item => item.velocity_x),
                            data.basic_data.map(item => item.velocity_y),
                            data.basic_data.map(item => item.velocity_z)
                        ];
                        selectedGraphDataLabels = ['Velocity X', 'Velocity Y', 'Velocity Z'];
                        break;
                    case 'pressure':
                        selectedData = [
                            data.basic_data.map(item => item.pressure)
                        ];
                        selectedGraphDataLabels = ['Pressure'];
                        break;
                    case 'battery':
                        selectedData = [
                            data.battery_data.map(item => item.battery)
                        ];
                        selectedGraphDataLabels = ['Battery'];
                    default:
                        break;
                }

                const labelColors = {
                    'Altitude': 'rgba(255, 99, 132, 1)', // Red
                    'Geo Altitude': 'rgba(54, 162, 235, 1)', // Blue
                    'Height': 'rgba(255, 206, 86, 1)', // Yellow
                    'Velocity X': 'rgba(75, 192, 192, 1)', // Green
                    'Velocity Y': 'rgba(153, 102, 255, 1)', // Purple
                    'Velocity Z': 'rgba(255, 159, 64, 1)', // Orange
                    'Pressure': 'rgba(0, 0, 0, 1)', // Black
                    'Battery': 'rgba(30, 240, 240, 1)' // Azure
                };

                myChart.data.datasets = selectedData.map((data, index) => ({
                    label: selectedGraphDataLabels[index],
                    data: data,
                    borderColor: labelColors[selectedGraphDataLabels[index]],
                    borderWidth: 1
                }));
                
                // which label will be selected (battery is in status)
                myChart.data.labels = selectedOption === 'battery' ? batteryLabels : labels;
                myChart.update();
            });

            let basicGraphCanvas = document.getElementById('basicGraph').querySelector('canvas');
            if (!basicGraphCanvas) {
                basicGraphCanvas = document.createElement('canvas');
                document.getElementById('basicGraph').appendChild(basicGraphCanvas);
            }

            // add some percentage under graph
            // for how many percents of time was drone charging
            // and add CHARGING: TRUE/FALSE to label in graph

            const ctx = basicGraphCanvas.getContext('2d');

            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: []
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

            // manually call event to update chart to initial data
            selectList.dispatchEvent(new Event('change'));
        })
        .catch(error => {
            console.error('Error when loading data:', error);
        });
    });
});
