const newsApiKey = '5cd50f87c3d040f8891f767f1bb4d31b';
const newsContainer = document.getElementById('news-container');

document.addEventListener('DOMContentLoaded', function() {
    fetch(`https://newsapi.org/v2/everything?q=weather&apiKey=${newsApiKey}`)
        .then(response => response.json())
        .then(data => {
            const articles = data.articles;
            newsContainer.innerHTML = ''; // Clear any existing content

            if (articles.length > 0) {
                articles.forEach(article => {
                    const articleElement = document.createElement('div');
                    articleElement.classList.add('news-item');

                    articleElement.innerHTML = `
                        <h2><a href="${article.url}" target="_blank">${article.title}</a></h2>
                        <p>${article.description}</p>
                        <small>Source: ${article.source.name}</small>
                    `;

                    newsContainer.appendChild(articleElement);
                });
            } else {
                newsContainer.innerHTML = '<p>No news articles found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            newsContainer.innerHTML = '<p>Error fetching news. Please try again later.</p>';
        });
});
