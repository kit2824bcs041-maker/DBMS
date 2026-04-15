document.addEventListener('DOMContentLoaded', () => {
    // Check API Status
    fetch('/api/health')
        .then(res => res.json())
        .then(data => {
            const apiStatus = document.getElementById('apiStatus');
            apiStatus.textContent = 'API Connected';
            document.querySelector('.dot').style.backgroundColor = '#10B981'; // Success Green
        })
        .catch(err => {
            const apiStatus = document.getElementById('apiStatus');
            apiStatus.textContent = 'API Disconnected';
            document.querySelector('.dot').style.backgroundColor = '#EF4444'; // Danger Red
        });

    // Chart.js Default styling
    Chart.defaults.color = '#9CA3AF';
    Chart.defaults.font.family = 'Inter, sans-serif';

    // Initialize Temperature Chart
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    const tempGradient = tempCtx.createLinearGradient(0, 0, 0, 400);
    tempGradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)'); // Red
    tempGradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

    const tempChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                borderColor: '#EF4444',
                backgroundColor: tempGradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: false, suggestedMin: 50, suggestedMax: 100, border: { dash: [4, 4] }, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Initialize Vibration Chart
    const vibCtx = document.getElementById('vibChart').getContext('2d');
    const vibGradient = vibCtx.createLinearGradient(0, 0, 0, 400);
    vibGradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)'); // Blue
    vibGradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

    const vibChart = new Chart(vibCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Vibration (g)',
                data: [],
                borderColor: '#3B82F6',
                backgroundColor: vibGradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, suggestedMax: 4, border: { dash: [4, 4] }, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Fetch and populate data
    function fetchData() {
        // Fetch Readings
        fetch('/api/readings')
            .then(res => res.json())
            .then(data => {
                const readings = data.data;
                const labels = readings.map(r => new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}));
                const temps = readings.map(r => r.temperature);
                const vibs = readings.map(r => r.vibration);

                tempChart.data.labels = labels;
                tempChart.data.datasets[0].data = temps;
                tempChart.update();

                vibChart.data.labels = labels;
                vibChart.data.datasets[0].data = vibs;
                vibChart.update();
            });

        // Fetch Anomalies
        fetch('/api/anomalies')
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById('anomaliesBody');
                tbody.innerHTML = '';
                data.data.forEach(anomaly => {
                    const tr = document.createElement('tr');
                    const statusClass = anomaly.status === 'Active' ? 'status-danger' : 'status-success';
                    const timeStr = new Date(anomaly.time).toLocaleString();
                    
                    tr.innerHTML = `
                        <td>#${anomaly.id}</td>
                        <td>${anomaly.device}</td>
                        <td>${anomaly.issue}</td>
                        <td>${timeStr}</td>
                        <td><span class="status-badge ${statusClass}">${anomaly.status}</span></td>
                    `;
                    tbody.appendChild(tr);
                });
            });
    }

    // Initial fetch and set interval
    fetchData();
    setInterval(fetchData, 5000); // Poll every 5s
});
