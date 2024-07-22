const API_KEY = "ea5e3677b3374e78a3ccc556e5b38e38";
const newsUrl = "https://newsapi.org/v2/everything?q=";
const headingUrl = "https://newsapi.org/v2/top-headlines?country=";

let articles = [];
let topHeadlines = [];
let currentIndex = 0;
const pageSize = 8;

document.addEventListener('DOMContentLoaded', () => {
    fetchNews("India");
    fetchTopHeadlines("in"); 
});

async function fetchNews(query) {
    try {
        const options = {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        };
        const response = await fetch(`${newsUrl}${query}`, options);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        articles = data.articles;
        currentIndex = 0;
        bindNewsData();
        console.log(data);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

async function fetchTopHeadlines(country) {
    try {
        const options = {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        };
        const response = await fetch(`${headingUrl}${country}`, options);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        topHeadlines = data.articles;
        bindHeadlinesData();
        console.log(data);
    } catch (error) {
        console.error('Error fetching top headlines:', error);
    }
}

function bindNewsData() {
    const cardContainer = document.getElementById("card-section");
    const newsCardTemplate = document.querySelector(".template-news-card");

    if (!newsCardTemplate) {
        console.error("News card template not found");
        return;
    }

    const articlesToLoad = articles.slice(currentIndex, currentIndex + pageSize);

    articlesToLoad.forEach(article => {
        if (!article.urlToImage) return; 
        const cardClone = newsCardTemplate.content.cloneNode(true);
        const newsImage = cardClone.querySelector(".news-image");
        const newsHeadline = cardClone.querySelector(".news-headline");
        const newsTime = cardClone.querySelector(".news-time");
        const newsSource = cardClone.querySelector(".news-source");

        newsImage.src = article.urlToImage;
        newsHeadline.textContent = article.title;
        newsTime.textContent = new Date(article.publishedAt).toLocaleString();
        newsSource.textContent = article.source.name;

        cardContainer.appendChild(cardClone);
    });

    currentIndex += pageSize;
}

function bindHeadlinesData() {
    const slidesContainer = document.querySelector('.top-stories');
    slidesContainer.innerHTML = ''; 

    // Limit to 5 headlines
    const limitedHeadlines = topHeadlines.slice(0, 5);

    limitedHeadlines.forEach((headline, index) => {
        if (!headline.urlToImage) return; 

        const slideClone = document.createElement('div');
        slideClone.classList.add('story', 'slide');

        slideClone.innerHTML = `
            <div class="left-image">
                <img src="${headline.urlToImage}" alt="" class="story-img">
            </div>
            <div class="right-storydetails">
                <div class="source-time">
                    <div class="source">
                        <img src="default" alt="" class="sourceImg">
                        <p>${headline.source.name}</p>
                    </div>
                    <p>${new Date(headline.publishedAt).toLocaleString()}</p>
                </div>
                <h2 class="story-title">${headline.title}</h2>
                <p class="story-description">${headline.description}</p>
                <a href="${headline.url}" class="read-more">read more</a>
            </div>
        `;

        slidesContainer.appendChild(slideClone);
    });

    updateSlidePosition(); 
}

document.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && currentIndex < articles.length) {
        bindNewsData();
    }
});

const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const slides = document.querySelector('.top-stories');
let currentIndexSlider = 0;

function updateSlidePosition() {
    const totalSlides = document.querySelectorAll('.slide').length; 
    slides.style.transform = `translateX(-${currentIndexSlider * 100}%)`;
}

function showNextSlide() {
    const totalSlides = document.querySelectorAll('.slide').length;
    if (currentIndexSlider < totalSlides - 1) {
        currentIndexSlider++;
    } else {
        currentIndexSlider = 0;
    }
    updateSlidePosition();
}

function showPrevSlide() {
    const totalSlides = document.querySelectorAll('.slide').length;
    if (currentIndexSlider > 0) {
        currentIndexSlider--;
    } else {
        currentIndexSlider = totalSlides - 1;
    }
    updateSlidePosition();
}

nextButton.addEventListener('click', showNextSlide);
prevButton.addEventListener('click', showPrevSlide);
