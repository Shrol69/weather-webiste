// Navigate to different pages
function navigateTo(page) {
    window.location.href = page;
}

// Handle form submission
document.getElementById('location-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const location = document.getElementById('location-input').value;
    searchLocation(location);
});

async function searchLocation(location) {
    try {
        const apiKey = 'cc57b19dd1660c3e9c40bd49ad86e89e'; // Replace with your OpenWeatherMap API key
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`);
        const weatherData = await weatherResponse.json();
        
        if (weatherData.cod === 200) {
            displayWeather(weatherData);
        } else {
            alert('Location not found');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeather(data) {
    document.getElementById('weather-info').innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
    `;
}
