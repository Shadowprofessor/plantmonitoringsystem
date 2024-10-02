// Get the dashboard element
const dashboard = document.getElementById('dashboard');

// Get the live feed button element
const liveFeedButton = document.getElementById('live-feed-button');

// Add an event listener to the live feed button
liveFeedButton.addEventListener('click', () => {
    // Open the live feed in a new window
    window.open('https://thingspeak.com/channels/2679947', '_blank');
});

// Get the Thingspeak channel ID
const channelId = '2679947';

// Get the Thingspeak API key
const apiKey = 'KR8S190NY76UDC68';

// Get the humidity, temperature, and moisture data from Thingspeak
fetch(`https://api.thingspeak.com/channels/${channelId}/fields/1.json?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        // Get the humidity data
        const humidityData = data.feeds.map(feed => feed.field1);

        // Get the temperature data
        const temperatureData = data.feeds.map(feed => feed.field2);

        // Get the moisture data
        const moistureData = data.feeds.map(feed => feed.field3);

        // Create a chart for the humidity data
        const humidityChart = new Chart(document.getElementById('humidity-chart'), {
            type: 'line',
            data: {
                labels: data.feeds.map(feed => feed.created_at),
                datasets: [{
                    label: 'Humidity',
                    data: humidityData,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        // Create a chart for the temperature data
        const temperatureChart = new Chart(document.getElementById('temperature-chart'), {
            type: 'line',
            data: {
                labels: data.feeds.map(feed => feed.created_at),
                datasets: [{
                    label: 'Temperature',
                    data: temperatureData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        // Create a chart for the moisture data
        const moistureChart = new Chart(document.getElementById('moisture-chart'), {
            type: 'line',
            data: {
                labels: data.feeds.map(feed => feed.created_at),
                datasets: [{
                    label: 'Moisture',
                    data: moistureData,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    })
    .catch(error => console.error(error));