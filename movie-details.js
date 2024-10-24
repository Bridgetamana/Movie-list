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

window.addEventListener("scroll", function () {
  window.scrollY >= 10
    ? header.classList.add("active")
    : header.classList.remove("active");
});

const apiKey = "1ec7b992";
const baseUrl = `https://www.omdbapi.com/?apikey=${apiKey}&type=movie&t=`;

const loader = document.querySelector(".loader");

async function fetchMovieDetails(title) {
  try {
    loader.style.display = "block"; 

    const response = await fetch(`${baseUrl}${title}`);
    const data = await response.json();

    if (data.Response === "True") {
      document.getElementById("movie-details").innerHTML = `
      <section class="movie-details-area">
        <div class="container">
          <div class="row justify-content-center gap-4 align-items-center position-relative">
            <div class="col-xl-3 col-lg-4">
              <div class="movie-details-img">
                <img src="${
                  data.Poster !== "N/A" ? data.Poster : "placeholder.jpg"
                }" alt="${data.Title}">
              </div>
            </div>
            <div class="col-xl-6 col-lg-8">
              <div class="movie-details-content">
                <h2>${data.Title} <span>(${data.Year})</span></h2>
                <div class="movie-details-info">
                  <ul>
                    <li>
                      <span>Rated: ${data.Rated}</span>
                      <span>hd</span>
                    </li>
                    <li>
                      <a href="#">${data.Genre.split(", ").join(", ")}</a>
                    </li>
                    <li>
                      <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                      </svg> ${
                        data.Released
                      }</span>
                      <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg> ${data.Runtime}</span>
                    </li>
                  </ul>
                </div>
                <p>${data.Plot}</p>
              </div>
            </div>
          </div>
        </div>
      </section>`;
    } else {
      document.getElementById("movie-details").innerHTML = `<p>Error: ${data.Error}</p>`;
    }

  } catch (error) {
    document.getElementById("movie-details").innerHTML = `<p>Error fetching movie details.</p>`;
  } finally {
    loader.style.display = "none"; 
  }
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const movieTitle = getQueryParam("title");
if (movieTitle) {
  fetchMovieDetails(movieTitle);
}
