const movieContainer = document.getElementById('movie-container');
const key = '1ec7b992';
const searchBox = document.getElementById('search-box');
const form = document.querySelector('form');
const modal = document.getElementById('modal');


// Function to fetch more details of a movie 
const fetchMovieDetails = (imdbID) => {
    fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${key}`)
        .then((res) => res.json())
        .then((data) => {
            modal.innerHTML = `
                <div class="modal-content">
                    
                    <span class="modal-header">
                        <h2>Movie Details</h2>
                        <i class="fa-solid fa-xmark" onclick="closeModal()"></i>
                    </span>

                    <div class='modal-img'>
                        <img src="${data.Poster}" alt="${data.Title}">
                    </div>
                    
                    <span class="modal-body">
                        <h3>${data.Title}</h3>
                        <h4>Details</h4>
                        <p>Genre: ${data.Genre}</p>
                        <p>Plot: ${data.Plot}</p>
                        <p>IMDb Rating: ${data.imdbRating}</p>
                        <p>Director: ${data.Director}</p>
                    </span>
                </div>
            `;
            modal.style.display = 'block';
        })
        .catch((err) => {
            console.error('Error fetching movie details:', err);
        });
};

// Function to handle click on "See Details" button
const handleSeeDetailsClick = (imdbID) => {
    fetchMovieDetails(imdbID);
};

// Function to render movie cards
const renderMovieCards = (movies) => {
    movieContainer.innerHTML = '';
    movies.forEach((movie) => {
        const movieCard = `
            <div class="movie-card">
                <div class="movie-img">                    
                    <img src="${movie.Poster}" alt="${movie.Title}" />
                </div>
                <span class="title-wrapper">
                    <h3 class="movie-title">${movie.Title.length > 20 ? movie.Title.slice(0, 15) + '...' : movie.Title}</h3>
                    <p class='movie-year'>Year: ${movie.Year}</p>
                </span>
                <button onclick="handleSeeDetailsClick('${movie.imdbID}')">See Details</button>
            </div>
        `;
        movieContainer.innerHTML += movieCard;
    });
};

// Function to fetch movies based on the search query
const fetchMovies = (title) => {
    fetch(`http://www.omdbapi.com/?s=${title}&apikey=${key}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.Response === "True") {
                renderMovieCards(data.Search);
            } else {
                movieContainer.innerHTML = '<p class="error-msg">No movies found with that title</p>';
            }
        })
        .catch((err) => {
            movieContainer.innerHTML = '<p class="error-msg">There was an error loading the movies</p>';
        });
};

// Event listener for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchBox.value.trim();
    if (searchTerm !== '') {
        fetchMovies(searchTerm);
    }
});

// Function to close modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}
