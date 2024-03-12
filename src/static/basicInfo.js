document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loadBtn').addEventListener('click', function() {
        fetch('homepage', {
            method: 'POST',
            body: new FormData(document.querySelector('form'))
        })
        .then(response => response.json())
        .then(data => {
            const labels = data.basic_data.map(item => {
                const date = new Date(item.time);
                // UTC
                date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
                // leading zero
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`;
            });
            
            const batteryLabels = data.battery_data.map(item => {
                const date = new Date(item.time);
                // UTC
                date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
                // leading zero
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`;
            });
            
            let selectedData = [];
            let selectedGraphDataLabels = [];

            // Selector
            const selectList = document.createElement('select');
            selectList.style.textAlign = 'center';
            selectList.style.top = '50%';
            selectList.style.width = '40%';
            selectList.style.transform = 'translateX(72.5%)';
            selectList.style.marginBottom = '10px';
            
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
            
            // hide selector in other tabs
            const btnGroup = document.querySelector('.btn-group');
            btnGroup.addEventListener('click', function(event) {
                if (event.target.classList.contains('graphBtn') && event.target.id !== 'basicBtn') {
                    selectList.style.display = 'none';
                } else {
                    selectList.style.display = 'block';
                }
            });

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
                        // graph data
                        selectedData = [
                            data.battery_data.map(item => item.battery)
                        ];
                        selectedGraphDataLabels = ['Battery'];
                        const chargingLabels = data.battery_data.map(item => item.charging);
                        selectedGraphDataLabels = selectedGraphDataLabels.map((label, index) => `${label} (Charging: ${chargingLabels[index]})`);
                        // charging time
                        createChargeElements(data);
                        break;
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

                chartInstances['basicGraph'].data.datasets = selectedData.map((data, index) => ({
                    label: selectedGraphDataLabels[index],
                    data: data,
                    borderColor: labelColors[selectedGraphDataLabels[index]],
                    borderWidth: 1
                }));
                
                // which label will be selected (battery is in status)
                chartInstances['basicGraph'].data.labels = selectedOption === 'battery' ? batteryLabels : labels;
                chartInstances['basicGraph'].update();
            });

            let basicGraphCanvas = document.getElementById('basicGraph').querySelector('canvas');
            if (!basicGraphCanvas) {
                basicGraphCanvas = document.createElement('canvas');
                document.getElementById('basicGraph').appendChild(basicGraphCanvas);
            }

            const ctx = basicGraphCanvas.getContext('2d');

            chartInstances['basicGraph'] = new Chart(ctx, {
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

            function createChargeElements(data){
                function _calculateChargingPercentage() {
                    const totalItems = data.battery_data.length;
                    const chargingItems = data.battery_data.filter(item => item.charging.toLowerCase() === "true").length;
                    const chargingPercentage = (chargingItems / totalItems) * 100;
                    return chargingPercentage.toFixed(2); 
                }
                
                // percentage of charging time
                const chargingPercentage = _calculateChargingPercentage(data);
                const chargingPercentageDiv = document.createElement('div');
                chargingPercentageDiv.textContent = `Percentage of time charging: ${chargingPercentage}%`;
                document.getElementById('basicGraphZoomBtn').insertAdjacentElement('afterend',chargingPercentageDiv);
                chargingPercentageDiv.style.display = 'block';
                chargingPercentageDiv.id = 'charging-percentage';
                chargingPercentageDiv.style.textAlign = 'center';

                // Log charging changes
                const changesTable = document.createElement('table');

                // table name
                const tableCaption = document.createElement('caption');
                tableCaption.textContent = 'Charging Intervals Log';
                changesTable.appendChild(tableCaption);
                changesTable.style.marginTop = '10px';
                tableCaption.style.textAlign = 'center';
                changesTable.style.captionSide = 'top';

                // headers
                const tableHead = document.createElement('thead');
                const headerRow = document.createElement('tr');

                const startTimeHeader = document.createElement('th');
                startTimeHeader.textContent = 'Start Time';
                headerRow.appendChild(startTimeHeader);

                const endTimeHeader = document.createElement('th');
                endTimeHeader.textContent = 'End Time';
                headerRow.appendChild(endTimeHeader);

                const durationHeader = document.createElement('th');
                durationHeader.textContent = 'Duration (s)';
                headerRow.appendChild(durationHeader);

                const chargingHeader = document.createElement('th');
                chargingHeader.textContent = 'Charging';
                headerRow.appendChild(chargingHeader);

                tableHead.appendChild(headerRow);
                changesTable.appendChild(tableHead);

                const tableBody = document.createElement('tbody');

                data.charging_changes_data.forEach(item => {
                    const row = document.createElement('tr');

                    const startTime = new Date(item.start_time);
                    const startTimeCell = document.createElement('td');
                    startTimeCell.textContent = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}:${startTime.getSeconds().toString().padStart(2, '0')}`;
                    row.appendChild(startTimeCell);
                    
                    const endTime = new Date(item.end_time);
                    const endTimeCell = document.createElement('td');
                    endTimeCell.textContent = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}:${endTime.getSeconds().toString().padStart(2, '0')}`;
                    row.appendChild(endTimeCell);

                    const durationCell = document.createElement('td');
                    durationCell.textContent = item.duration;
                    row.appendChild(durationCell);

                    const chargingCell = document.createElement('td');
                    chargingCell.textContent = item.charging;
                    row.appendChild(chargingCell);

                    tableBody.appendChild(row);
                });
                changesTable.appendChild(tableBody);
                changesTable.id = 'changes-table';
                document.getElementById('charging-percentage').insertAdjacentElement('afterend',changesTable);

               // TODO: HIDE PERCENTAGE & TABLE IN OTHER TABS
            }
        })
        .catch(error => {
            console.error('Error when loading data:', error);
        });
    });
});
