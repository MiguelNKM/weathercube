document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('cityInput');
    const getWeatherBtn = document.getElementById('getWeatherBtn');
    const locationInfo = document.getElementById('locationInfo');
    const weatherInfoDiv = document.getElementById('weatherInfo');

    // Check for geolocation support
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByLocation(lat, lon);
        }, () => {
            locationInfo.textContent = "Could not get your location. Please enter a city name.";
        });
    } else {
        locationInfo.textContent = "Geolocation is not supported by this browser.";
    }

    getWeatherBtn.addEventListener('click', function() {
        const city = cityInput.value;
        if (city) {
            getWeather(city);
        } else {
            alert('Please enter a city name or allow location access');
        }
    });

    function getWeather(city) {
        const apiKey = 'ac7d97c519bb4432a08110759242908';
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.location) {
                    displayWeather(data);
                    checkForAlerts(data);
                } else {
                    alert('City not found');
                }
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function getWeatherByLocation(lat, lon) {
        const apiKey = 'YOUR_API_KEY';
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.location) {
                    displayWeather(data);
                    checkForAlerts(data);
                } else {
                    alert('Location not found');
                }
            })
            .catch(error => console.error('Error fetching weather data:', error));
    }

    function displayWeather(data) {
        locationInfo.textContent = `Weather in ${data.location.name}, ${data.location.region}`;
        weatherInfoDiv.innerHTML = `
            <h2>${data.current.temp_c}°C</h2>
            <p><strong>Description:</strong> ${data.current.condition.text}</p>
            <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${data.current.wind_kph} kph</p>
        `;
    }

    function checkForAlerts(data) {
        const condition = data.current.condition.text.toLowerCase();
        const dangerousConditions = ['tornado', 'heavy rain', 'flash flood', 'thunderstorm'];
        
        dangerousConditions.forEach(alert => {
            if (condition.includes(alert)) {
                notifyUser(`Dangerous weather alert: ${alert.charAt(0).toUpperCase() + alert.slice(1)}`, `The weather in ${data.location.name} is currently experiencing ${alert}. Please take precautions.`);
            }
        });
    }

    function notifyUser(title, message) {
        if (Notification.permission === 'granted') {
            new Notification(title, { body: message });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }
    }
});