const weatherApiKey = 'c2e6c79d20bc35622bc4c3e5df1f9005';
const newsApiKey = '5cd50f87c3d040f8891f767f1bb4d31b';
const imageApiKey = 'u0cM_NgGBoZnnQ0hcd8d00EtLZvEtw0s3NJ3o-S0tAU';  // Unsplash API key

document.getElementById('location-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const location = document.getElementById('location-input').value;
    if (location) {
        getWeather(location);
        getNews(location);
        getImage(location);
    } else {
        alert('Please enter a location.');
    }
});

async function getWeather(location) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${weatherApiKey}`);
        const data = await response.json();
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            alert('Weather data not found for this location.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

function displayWeather(data) {
    document.getElementById('city-name').innerText = data.name;
    document.getElementById('weather-description').innerText = data.weather[0].description;
    document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°C`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} m/s`;
}

async function getNews(location) {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=${location}&pageSize=3&apiKey=${newsApiKey}`);
        const data = await response.json();
        if (data.articles) {
            displayNews(data.articles);
        } else {
            alert('No news articles found for this location.');
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news');
    newsContainer.innerHTML = '';
    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.classList.add('news-article');
        articleElement.innerHTML = `
            <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
            <p>${article.description}</p>
        `;
        newsContainer.appendChild(articleElement);
    });
}

async function getImage(location) {
    try {
        // Query for landmarks and famous places
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${location} famous landmark&client_id=${imageApiKey}`);
        const data = await response.json();
        if (data.results.length > 0) {
            const imageUrl = data.results[0]?.urls?.regular;
            displayImage(imageUrl);
        } else {
            displayImage(null); // No image found
        }
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

function displayImage(imageUrl) {
    const imageContainer = document.getElementById('image-container');
    if (imageUrl) {
        imageContainer.innerHTML = `<img src="${imageUrl}" alt="Image of ${document.getElementById('location-input').value}">`;
    } else {
        imageContainer.innerHTML = `<p>No image found for this location.</p>`;
    }
}
