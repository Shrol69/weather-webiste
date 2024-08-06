const weatherApiKey = 'c2e6c79d20bc35622bc4c3e5df1f9005';
const newsApiKey = '5cd50f87c3d040f8891f767f1bb4d31b';
const imageApiKey = 'u0cM_NgGBoZnnQ0hcd8d00EtLZvEtw0s3NJ3o-S0tAU';

function showLoadingSpinner(show) {
    document.getElementById('loading-spinner').style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.innerText = message;
    errorMessage.style.display = 'block';
    setTimeout(() => errorMessage.style.display = 'none', 5000);
}

document.getElementById('location-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const location = document.getElementById('location-input').value;
    showLoadingSpinner(true);
    getWeather(location).finally(() => showLoadingSpinner(false));
    getWeatherNews(location).finally(() => showLoadingSpinner(false));
    getLocationImage(location).finally(() => showLoadingSpinner(false));
});

async function getWeather(location) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${weatherApiKey}`);
        const data = await response.json();
        if (data.cod !== 200) throw new Error(data.message);
        displayWeather(data);
        getWeatherImage(data.weather[0].main);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Failed to fetch weather data. Please try again.');
    }
}

async function getWeatherNews(location) {
    try {
        const query = `${location} weather`;
        const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${newsApiKey}`);
        const data = await response.json();
        if (data.status !== 'ok') throw new Error(data.message);
        if (data.articles.length === 0) {
            displayNews([{ title: 'No news available', description: 'There are no news articles available for this location.' }]);
        } else {
            displayNews(data.articles.slice(0, 5));
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('Failed to fetch news. Please try again.');
    }
}

async function getWeatherImage(weatherCondition) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${weatherCondition}&client_id=${imageApiKey}`);
        const data = await response.json();
        if (data.results.length > 0) {
            const imageUrl = data.results[0]?.urls?.regular;
            displayWeatherImage(imageUrl);
        } else {
            displayWeatherImage(null);
        }
    } catch (error) {
        console.error('Error fetching weather image:', error);
        showError('Failed to fetch weather image. Please try again.');
    }
}

async function getLocationImage(location) {
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${location} famous landmark&client_id=${imageApiKey}`);
        const data = await response.json();
        if (data.results.length > 0) {
            const imageUrl = data.results[0]?.urls?.regular;
            displayLocationImage(imageUrl);
        } else {
            displayLocationImage(null);
        }
    } catch (error) {
        console.error('Error fetching location image:', error);
        showError('Failed to fetch location image. Please try again.');
    }
}

function displayWeather(data) {
    document.getElementById('city-name').innerText = data.name;
    document.getElementById('weather-description').innerText = data.weather[0].description;
    document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°C`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} m/s`;
}

function displayWeatherImage(imageUrl) {
    document.getElementById('weather-container').style.backgroundImage = imageUrl ? `url(${imageUrl})` : 'none';
}

function displayLocationImage(imageUrl) {
    document.getElementById('location-image').src = imageUrl || '';
    document.getElementById('location-image').alt = imageUrl ? 'Famous Landmark' : 'No image available';
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'news-article';
        articleElement.innerHTML = `
            <h4>${article.title}</h4>
            <p>${article.description || ''}</p>
        `;
        newsContainer.appendChild(articleElement);
    });
}
