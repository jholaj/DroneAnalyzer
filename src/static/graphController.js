//TODO: Solve changing tabs

function showGraph(event){
    // default
    document.getElementById('basicBtn').classList.add('active');
    
    var graphSection = document.getElementById('graphSection');
    graphSection.style.display = 'block';
    event.preventDefault();
}

function switchGraph(graphType) {
    document.querySelectorAll('.graph').forEach(graph => {
        graph.style.display = 'none';
    });

    document.querySelectorAll('.graphBtn').forEach(btn => {
        btn.classList.remove('active');
    });

    switch(graphType) {
        case 'telemetry':
            document.getElementById('basicBtn').classList.add('active');
            document.getElementById('basicGraph').style.display = 'block';
            break;
        case 'status':
            document.getElementById('accuracyBtn').classList.add('active');
            document.getElementById('accuracyGraph').style.display = 'block';
            break;
        case 'signal':
            document.getElementById('signalBtn').classList.add('active');
            document.getElementById('signalGraph').style.display = 'block';
            break;
        case 'map':
            document.getElementById('mapBtn').classList.add('active');
            document.getElementById('mapGraph').style.display = 'block';
            break;
        default:
            console.error('Unknown type of graph.');
            break;
    }
}