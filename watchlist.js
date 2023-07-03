import './input.css';

const watchlistEl = document.getElementById('my-watchlist');

function renderWatchList(movie) {
  const { image, title, year, ratings, runtime, genre, id, plot } = movie;
  const movieCard = document.createElement('div');
  movieCard.classList.add('card');

  movieCard.innerHTML = `
    <div class="image-container">
      <img src="${image}">
    </div>
    <div class="main">
      <div class="result-top-row">
        <h2>${title} (${year})</h2>
          <span><i class="fa-solid fa-star"></i></span>
        <div>${ratings}</div>
      </div>
      <div class="result-middle-row">
        <div>${runtime}</div>
        <div>${genre}</div>
        <button id="remove-watchlist-${id}" class="watchlist-btn"
          data-id=${id}
        >
          <span>
            <i class="fa-solid fa-circle-minus"></i>
          </span> Remove
        </button>
      </div>
      <div class="result-bottom-row">
        <div>${plot}</div>
      </div>
    </div>
    `;

  watchlistEl.appendChild(movieCard);
}

/*
  On load render movies from localStorage
*/
document.addEventListener('DOMContentLoaded', () => {
  const movies = JSON.parse(localStorage.getItem('movies'));
  if (!movies) {
    return;
  }

  watchlistEl.innerHTML = '';

  movies.forEach((movie) => {
    renderWatchList(movie);
  });
});

/*
  On click remove item and render watchlist
*/
watchlistEl.addEventListener('click', (e) => {
  let watchList = JSON.parse(localStorage.getItem('movies'));
  watchList = watchList.filter((movie) => movie.id !== e.target.dataset.id);
  watchlistEl.innerHTML = '';
  watchList.forEach((movie) => {
    renderWatchList(movie);
  });
  localStorage.setItem('movies', JSON.stringify(watchList));
});
