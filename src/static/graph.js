function showGraph(event){
    // default
    document.getElementById('telemetryBtn').classList.add('active');
    
    var graphSection = document.getElementById('graphSection');
    graphSection.style.display = 'block';
    event.preventDefault();
}

function showTelemetry() {
    document.getElementById('telemetryBtn').classList.add('active');
    document.getElementById('statusBtn').classList.remove('active');
    document.getElementById('telemetryGraph').style.display = 'block';
    document.getElementById('statusGraph').style.display = 'none';
}

function showStatus() {
    document.getElementById('statusBtn').classList.add('active');
    document.getElementById('telemetryBtn').classList.remove('active');
    document.getElementById('telemetryGraph').style.display = 'none';
    document.getElementById('statusGraph').style.display = 'block';
}