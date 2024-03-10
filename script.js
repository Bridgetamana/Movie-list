const movieContainer = document.getElementById('movie-container');
const key = '1ec7b992';
const searchBox = document.getElementById('search-box');
const form = document.querySelector('form');

// Function to fetch movies based on the search query
const fetchMovies = (title) => {
    fetch(`http://www.omdbapi.com/?s=${title}&apikey=${key}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.Response === "True") {
                const movies = data.Search;
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
                            <button>See Details</button>
                        </div>
                    `;
                    movieContainer.innerHTML += movieCard;
                });
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

