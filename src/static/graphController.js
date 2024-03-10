// all chart instances
let chartInstances = {};

function showGraph(event){
    // default
    document.getElementById('basicBtn').classList.add('active');
    var graphSection = document.getElementById('graphSection');
    graphSection.style.display = 'block';
    addResetZoomButton('basicGraph');
    event.preventDefault();
}

function switchGraph(graphType) {
    document.querySelectorAll('.graph').forEach(graph => {
        graph.style.display = 'none';
    });

    document.querySelectorAll('.graphBtn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelectorAll('.resetZoomBtn').forEach(button => {
        button.style.display = 'none';
    });

    switch(graphType) {
        case 'basic':
            document.getElementById('basicBtn').classList.add('active');
            document.getElementById('basicGraph').style.display = 'block';
            addResetZoomButton('basicGraph');
            break;
        case 'accuracy':
            document.getElementById('accuracyBtn').classList.add('active');
            document.getElementById('accuracyGraph').style.display = 'block';
            addResetZoomButton('accuracyGraph');
            break;
        case 'signal':
            document.getElementById('signalBtn').classList.add('active');
            document.getElementById('signalGraph').style.display = 'block';
            addResetZoomButton('signalGraph');
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

function addResetZoomButton(graphId) {
    var resetZoomButtonId = graphId + 'ZoomBtn';
    var isCreated = document.getElementById(resetZoomButtonId);

    if (!isCreated) {
        var resetZoomButton = document.createElement('button');
        resetZoomButton.innerHTML = 'Reset Zoom';
        resetZoomButton.classList.add('resetZoomBtn');
        resetZoomButton.id = resetZoomButtonId;
        resetZoomButton.onclick = function() {
            var chart = chartInstances[graphId];
            if (chart) {
                chart.resetZoom();
            }
        };
        var graphContainer = document.getElementById(graphId);
        // under graph
        graphContainer.insertAdjacentElement('afterend', resetZoomButton);
    }
    document.getElementById(resetZoomButtonId).style.display = 'block';
}