const apikey = '8218e8fdf20f4372a01ba7e718d5f694';

const blogContainer = document.getElementById("blog-container"); // Fixed ID
const searchField = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

async function fetchRandomNews() {
    try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?sources=techcrunch&pageSize=20&apikey=${apikey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.articles || []; // Ensure it always returns an array
    } catch (error) {
        console.error("Error fetching random news:", error);
        return [];
    }
}

async function fetchNewsQuery(query) {
    try {
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=20&apikey=${apikey}`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.articles || []; // Ensure it always returns an array
    } catch (error) {
        console.error("Error fetching news by query:", error);
        return [];
    }
}

searchButton.addEventListener('click', async () => {
    const query = searchField.value.trim();
    if (query !== "") {
        try {
            const articles = await fetchNewsQuery(query);
            displayBlogs(articles);
        } catch (error) {
            console.error("Error fetching news by query:", error);
        }
    }
});

function displayBlogs(articles) {
    blogContainer.innerHTML = ""; // Clear the container

    articles.forEach((article) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");

        const img = document.createElement("img");
        img.src = article.urlToImage || "https://placehold.co/600x400?text=No+Image"; // Fallback for missing image
        img.alt = article.title || "No title available"; // Fallback for missing title

        const title = document.createElement("h2");
        const truncatedTitle = article.title
            ? (article.title.length > 30
                ? article.title.slice(0, 30) + "....."
                : article.title)
            : "No Title Available";
        title.textContent = truncatedTitle;

        const description = document.createElement("p");
        const truncatedDes = article.description
            ? (article.description.length > 80
                ? article.description.slice(0, 80) + "....."
                : article.description)
            : "No description available.";
        description.textContent = truncatedDes;

        // Append elements to the blog card
        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);

        // Open the article link on click
        blogCard.addEventListener('click', () => {
            window.open(article.url, "_blank");
        });

        // Append blog card to the container
        blogContainer.appendChild(blogCard);
    });
}

(async () => {
    try {
        const articles = await fetchRandomNews();
        displayBlogs(articles);
    } catch (error) {
        console.error("Error displaying blogs:", error);
    }
})();
