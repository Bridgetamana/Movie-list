const navOpenBtn = document.querySelector(".menu-open-btn");
const navCloseBtn = document.querySelector(".menu-close-btn");
const navbar = document.querySelector(".navbar");
const backdrop = document.querySelector(".menu-backdrop");

function toggleNav() {
  navbar.classList.toggle("active");
  backdrop.classList.toggle("active");
}

navOpenBtn.addEventListener("click", toggleNav);
navCloseBtn.addEventListener("click", toggleNav);

const header = document.querySelector(".header");
const scrollbtn = document.querySelector(".scroll-up");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 10) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }

  if (window.scrollY >= 200) {
    scrollbtn.classList.add("visible");
  } else {
    scrollbtn.classList.remove("visible");
  }
});

const apiKey = '1ec7b992';
const baseUrl = `https://www.omdbapi.com/?apikey=${apiKey}&type=movie&t=`;
let currentPage = 1;
const moviesPerPage = 12;
const moviesListElement = document.querySelector('.movies-list');
const pageInfoElement = document.querySelector('.page-info');
const prevButton = document.querySelector('.prev-btn');
const nextButton = document.querySelector('.next-btn');
const loaderElement = document.querySelector('.loader'); 

let watchlist = [];

async function fetchWatchlist() {
  try {
    const response = await fetch('movies.json');
    const data = await response.json();
    watchlist = data.watchlist;
    fetchMoviesFromWatchlist(currentPage);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
  }
}

async function fetchMoviesFromWatchlist(page) {
  moviesListElement.innerHTML = '';
  loaderElement.style.display = 'block';

  const searchQuery = document.getElementById("movie-search-box").value.trim().toLowerCase();
  const filteredWatchlist = watchlist.filter(movieTitle => movieTitle.toLowerCase().includes(searchQuery));

  const startIndex = (page - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const moviesToDisplay = filteredWatchlist.slice(startIndex, endIndex);

  try {
    const moviesData = await Promise.all(moviesToDisplay.map(movieTitle =>
      fetch(`${baseUrl}${movieTitle}`).then(res => res.json())
    ));

    moviesData.forEach((data, index) => {
      const movieItem = document.createElement('div');
      movieItem.classList.add('col-xl-3', 'col-lg-4', 'col-sm-6');

      if (data.Response === 'True') {
        movieItem.innerHTML = `
          <div class="movie-item mb-6">
            <div class="movie-poster">
              <a href="movie.html?title=${encodeURIComponent(data.Title)}">
                <img src="${data.Poster !== 'N/A' ? data.Poster : 'placeholder.jpg'}" alt="${data.Title}">
              </a>
            </div>
            <div class="movie-content">
              <div class="top">
                <h5 class="title">
                  <a href="movie.html?title=${encodeURIComponent(data.Title)}">${data.Title}</a>
                </h5>
                <span class="date">${data.Year}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        movieItem.innerHTML = `<p>${moviesToDisplay[index]}: ${data.Error}</p>`;
      }

      moviesListElement.appendChild(movieItem);
    });
  } catch (error) {
    console.error('Fetch error: ', error);
    moviesListElement.innerHTML = `<p class="text-danger">Error fetching movie details.</p>`;
  }

  loaderElement.style.display = 'none';
  updatePageInfo(filteredWatchlist.length);
}

function updatePageInfo() {
  const totalPages = Math.ceil(watchlist.length / moviesPerPage);
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

function changePage(increment) {
  const totalPages = Math.ceil(watchlist.length / moviesPerPage);
  currentPage = Math.min(Math.max(currentPage + increment, 1), totalPages);
  fetchMoviesFromWatchlist(currentPage);
}

prevButton.addEventListener('click', () => changePage(-1));
nextButton.addEventListener('click', () => changePage(1));

fetchWatchlist();
