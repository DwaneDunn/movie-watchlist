import './input.css';

const apiKey = import.meta.env.VITE_MOVIE_API;

const searchEl = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const moviesEl = document.getElementById('movies');

function renderData(movie, movieId) {
  const { Poster, Title, Year, Ratings, Runtime, Genre, Plot } = movie;
  const rating =
    Ratings.length > 0 ? movie.Ratings[0].Value.slice(0, 3) : 'N/A';
  const movieCard = document.createElement('div');
  movieCard.classList.add('card');

  movieCard.innerHTML = `
    <div class="image-container">
      <img src="${Poster === 'N/A' ? '' : Poster}">
    </div>
    <div class="main">
      <div class="result-top-row">
        <h2>${Title} (${Year})</h2>
          <span><i class="fa-solid fa-star"></i></span>
        <div>${rating}</div>
      </div>
      <div class="result-middle-row">
        <div>${Runtime}</div>
        <div>${Genre}</div>
        <button id="add-watchlist-${movieId}" class="watchlist-btn"
          data-id=${movieId}
          data-image=${Poster}
          data-title='${Title}'
          data-year=${Year}
          data-ratings=${rating}
          data-runtime='${Runtime}'
          data-genre='${Genre}'
          data-plot='${Plot}'
        >
          <span>
            <i class="fa-solid fa-circle-plus fa-lg"></i>
          </span> Watchlist
        </button>
      </div>
      <div class="result-bottom-row">
        <div>${Plot}</div>
      </div>
    </div>
    `;

  moviesEl.appendChild(movieCard);
}

// Look up film using imdbID
async function lookupMovie(imdbID) {
  const URL = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;

  try {
    const response = await fetch(URL);
    if (response.status === 200) {
      const movieDetails = await response.json();

      renderData(movieDetails, imdbID);
    }
  } catch (error) {
    console.log(error);
    throw new Error(`HTTP error! status: ${error.status}`);
  }
}

// onSubmit fire this function
async function searchForFilm() {
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchEl.value}&page=1`;

  moviesEl.innerHTML = '';

  try {
    const response = await fetch(url);

    if (response.status === 200) {
      const data = await response.json();
      const searchResults = data.Search;

      searchResults.forEach((movie) => {
        lookupMovie(movie.imdbID);
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`HTTP error! status: ${error.status}`);
  }
}

// Submit Event Listener
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  searchForFilm();
});

moviesEl.addEventListener('click', (e) => {
  const movie = e.target.dataset;

  if (localStorage.getItem('movies')) {
    const watchList = JSON.parse(localStorage.getItem('movies'));
    watchList.push(movie);
    localStorage.setItem('movies', JSON.stringify(watchList));
  } else {
    const watchList = [];
    watchList.push(movie);
    localStorage.setItem('movies', JSON.stringify(watchList));
  }
});
