const API_KEY = '53d6fa6cdd2204b65da66171ef667b2a';
  const BASE_URL = 'https://api.themoviedb.org/3';
  const IMG_URL = 'https://image.tmdb.org/t/p/w500';

  // Map genre names (matching your HTML section IDs) to TMDb genre IDs
  const genreMap = {
  'sci-fi': 878,
  'mystery': 9648,
  'space-travel': 878, // Sci-Fi
  'animation': 16,
  'fantasy': 14,
  'history': 36,
  'thriller': 53,
  'adventure': 12,
  'action': 28,
  'documentary': 99,
  'drama': 18,
  'comedy': 35,
  'family': 10751,
  'horror': 27,
  'romance': 10749,
  'war': 10752,
  'western': 37,
  'crime': 80,
  'music': 10402
  };

  // For each genre section, show loading placeholder, then fetch and display movies
  // --- Interactive View More for each genre section ---
  Object.keys(genreMap).forEach(genre => {
    let page = 1;
    const sectionGrid = document.getElementById(`movie-grid-${genre}`);
    const viewMoreBtn = document.querySelector(`#movie-grid-${genre}`)?.parentElement?.nextElementSibling;
    function loadMovies() {
      if (sectionGrid) {
        // Show loading placeholder
        if (page === 1) {
          sectionGrid.innerHTML = `
            <div class="isnotloading"></div>
            <div class="isnotloading"></div>
            <div class="isnotloading"></div>
            <div class="isnotloading"></div>
            <div class="isnotloading"></div>
          `;
        }
        fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreMap[genre]}&sort_by=popularity.desc&page=${page}`)
          .then(res => res.json())
          .then(data => {
            if (page === 1) sectionGrid.innerHTML = '';
            data.results.slice(0, 5).forEach(movie => {
              const card = document.createElement('div');
              card.className = 'movie-card';
              card.style = 'padding:18px 16px 16px 16px;border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,0.18);width:260px;max-width:90vw;text-align:center;transition:transform 0.3s;margin:24px auto 0 auto;';
              // Create image element
              const img = document.createElement('img');
              img.src = movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/220x330?text=No+Image';
              img.alt = movie.title;
              img.style = 'width:100%;max-width:220px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);margin-bottom:8px;';
              img.onerror = function() {
                img.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'isnotloading2';
                card.insertBefore(placeholder, card.firstChild);
              };
              // Format genre name: capitalize and replace hyphens with spaces
              const genreDisplay = genre.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
              card.innerHTML += `
                <div style=\"margin-bottom:8px;\"><span style=\"background:#fff;color:#1e90ff;padding:2px 10px;border-radius:8px;font-size:0.98em;font-weight:bold;letter-spacing:0.5px;\">${genreDisplay}</span></div>
              `;
              card.appendChild(img);
              card.innerHTML += `
                <h3 style=\"margin:8px 0 4px 0;color:#fff;\">${movie.title}</h3>
                <p style=\"margin:0 0 4px 0;font-size:0.95em;color:#ffd700;\">⭐ ${movie.vote_average}</p>
                <p style=\"font-size:0.95em;line-height:1.4;color:#eee;\">${movie.overview ? movie.overview.slice(0, 100) + '...' : 'No overview available.'}</p>
                <button class=\"view-movie-btn\" style=\"margin-top:10px;padding:8px 18px;border:none;border-radius:6px;background:#1e90ff;color:#fff;font-weight:bold;cursor:pointer;transition:background 0.3s;\">View movie</button>
              `;
              setTimeout(() => {
                const btn = card.querySelector('.view-movie-btn');
                if (btn) {
                  btn.addEventListener('click', function() {
                    const movieData = {
                      id: movie.id,
                      title: movie.title,
                      overview: movie.overview,
                      popularity: movie.popularity,
                      release_date: movie.release_date,
                      vote_average: movie.vote_average,
                      vote_count: movie.vote_count,
                      poster_path: movie.poster_path,
                      imgUrl: IMG_URL
                    };
                    localStorage.setItem('selectedMovie', JSON.stringify(movieData));
                    window.location.href = 'learn2.html';
                  });
                }
              }, 0);
              sectionGrid.appendChild(card);
            });
          })
          .catch(() => {
            setTimeout(() => {
              showNoInternetPopup();
            }, 3000);
          });
      }
    }
    loadMovies();
    if (viewMoreBtn) {
      viewMoreBtn.style.margin = '32px 0 32px 0';
      viewMoreBtn.addEventListener('click', function() {
        page++;
        loadMovies();
      });
    }
  });

  // Fetch and display latest movies in the "Latest Movies" section

  let latestPage = 1;
  let latestMoviesCache = [];
  let latestInterval = null;
  function fetchLatestMovies(page = 1, animate = false) {
    const latestGrid = document.getElementById('movie-grid-latest');
    if (!latestGrid) return;
    // Show loading placeholder
    if (!animate) latestGrid.innerHTML = '<div class="isnotloading"></div>';
    fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`)
      .then(res => res.json())
      .then(data => {
        latestMoviesCache = data.results;
        if (!animate) latestGrid.innerHTML = '';
        showLatestMoviesWithAnimation(data.results, latestGrid, animate);
      })
      .catch(() => {
        setTimeout(() => {
            showNoInternetPopup();
        }, 3000);
      });
  }

  function showLatestMoviesWithAnimation(movies, latestGrid, animate) {
    if (!latestGrid) return;
    if (animate) {
      latestGrid.classList.add('fade-out');
      setTimeout(() => {
        latestGrid.innerHTML = '';
        for (let i = 0; i < 5; i++) {
          if (!movies[i]) continue;
          const movie = movies[i];
          const card = document.createElement('div');
          card.className = 'movie-card fade-in';
          card.style = 'padding:18px 16px 16px 16px;border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,0.18);width:260px;max-width:90vw;text-align:center;transition:transform 0.3s;margin:0 40px;';
          const img = document.createElement('img');
          img.src = movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/220x330?text=No+Image';
          img.alt = movie.title;
          img.style = 'width:100%;max-width:220px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);margin-bottom:8px;';
          img.onerror = function() {
            img.style.display = 'none';
            const placeholder = document.createElement('div');
            card.insertBefore(placeholder, card.firstChild);
          };
          card.appendChild(img);
          card.innerHTML += `
            <h3 style=\"margin:8px 0 4px 0;color:#fff;\">${movie.title}</h3>
            <p style=\"margin:0 0 4px 0;font-size:0.95em;color:#ffd700;\">⭐ ${movie.vote_average}</p>
            <p style=\"font-size:0.95em;line-height:1.4;color:#eee;\">${movie.overview ? movie.overview.slice(0, 100) + '...' : 'No overview available.'}</p>
            <button class=\"view-movie-btn\" style=\"margin-top:10px;padding:8px 18px;border:none;border-radius:6px;background:#1e90ff;color:#fff;font-weight:bold;cursor:pointer;transition:background 0.3s;\">View Movie</button>
          `;
          setTimeout(() => {
            const btn = card.querySelector('.view-movie-btn');
            if (btn) {
              btn.addEventListener('click', function() {
                const movieData = {
                  id: movie.id,
                  title: movie.title,
                  overview: movie.overview,
                  popularity: movie.popularity,
                  release_date: movie.release_date,
                  vote_average: movie.vote_average,
                  vote_count: movie.vote_count,
                  poster_path: movie.poster_path,
                  imgUrl: IMG_URL
                };
                localStorage.setItem('selectedMovie', JSON.stringify(movieData));
                window.location.href = 'learn2.html';
              });
            }
          }, 0);
          latestGrid.appendChild(card);
        }
        latestGrid.classList.remove('fade-out');
      }, 20000);
    } else {
      latestGrid.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        if (!movies[i]) continue;
        const movie = movies[i];
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.style = 'padding:18px 16px 16px 16px;border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,0.18);width:260px;max-width:90vw;text-align:center;transition:transform 0.3s;margin:0 40px;';
        const img = document.createElement('img');
        img.src = movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/220x330?text=No+Image';
        img.alt = movie.title;
        img.style = 'width:100%;max-width:220px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);margin-bottom:8px;';
        img.onerror = function() {
          img.style.display = 'none';
          const placeholder = document.createElement('div');
          placeholder.className = 'isnotloading';
          card.insertBefore(placeholder, card.firstChild);
        };
        card.appendChild(img);
        card.innerHTML += `
          <h3 style=\"margin:8px 0 4px 0;color:#fff;\">${movie.title}</h3>
          <p style=\"margin:0 0 4px 0;font-size:0.95em;color:#ffd700;\">⭐ ${movie.vote_average}</p>
          <p style=\"font-size:0.95em;line-height:1.4;color:#eee;\">${movie.overview ? movie.overview.slice(0, 100) + '...' : 'No overview available.'}</p>
          <button class=\"view-movie-btn\" style=\"margin-top:10px;padding:8px 18px;border:none;border-radius:6px;background:#1e90ff;color:#fff;font-weight:bold;cursor:pointer;transition:background 0.3s;\">View Movie</button>
        `;
        setTimeout(() => {
          const btn = card.querySelector('.view-movie-btn');
          if (btn) {
            btn.addEventListener('click', function() {
              const movieData = {
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                popularity: movie.popularity,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
                poster_path: movie.poster_path,
                imgUrl: IMG_URL
              };
              localStorage.setItem('selectedMovie', JSON.stringify(movieData));
              window.location.href = 'learn2.html';
            });
          }
        }, 0);
        latestGrid.appendChild(card);
      }
    }
  }

  // Animation: load new movies every 7 seconds
  document.addEventListener('DOMContentLoaded', function() {
    let latestPage = 1;
    fetchLatestMovies(latestPage);
    if (latestInterval) clearInterval(latestInterval);
    latestInterval = setInterval(() => {
      latestPage++;
      fetchLatestMovies(latestPage, true);
    }, 20000);
  });

  // Call this function on page load
  fetchLatestMovies();

  // Search functionality for the search bar in the header
  function searchMovies() {
  const query = document.getElementById('search-input').value.trim();
  const latestGrid = document.getElementById('movie-grid-latest');
  // Scroll to the latest movies section
  const latestSection = document.getElementById('home');
  if (latestSection) {
    latestSection.scrollIntoView({ behavior: 'smooth' });
  }
  if (!query) {
    // If search is empty, reload latest movies
    fetchLatestMovies();
    return;
  }
  fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      
      latestGrid.innerHTML = '';
      if (data.results.length === 0) {
        window.alert('Movie not found');
        return;
      }
      data.results.slice(0, 5).forEach(movie => {
        console.log(movie);
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.style = 'padding:18px 16px 16px 16px;border-radius:14px;box-shadow:0 4px 24px rgba(0,0,0,0.18);width:260px;max-width:90vw;text-align:center;transition:transform 0.3s;margin:0 40px;';
        // Create image element
        const img = document.createElement('img');
        img.src = movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/220x330?text=No+Image';
        img.alt = movie.title;
        img.style = 'width:100%;max-width:220px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);margin-bottom:8px;';
        // If image fails to load, show .isnotloading placeholder
        img.onerror = function() {
          img.style.display = 'none';
          const placeholder = document.createElement('div');
          placeholder.className = 'isnotloading';
          card.insertBefore(placeholder, card.firstChild);
        };
        card.appendChild(img);
        card.innerHTML += `
          <h3 style=\"margin:8px 0 4px 0;color:#fff;\">${movie.title}</h3>
          <p style=\"margin:0 0 4px 0;font-size:0.95em;color:#ffd700;\">⭐ ${movie.vote_average}</p>
          <p style=\"font-size:0.95em;line-height:1.4;color:#eee;\">${movie.overview ? movie.overview.slice(0, 100) + '...' : 'No overview available.'}</p>
          <button class=\"view-movie-btn\" style=\"margin-top:10px;padding:8px 18px;border:none;border-radius:6px;background:#1e90ff;color:#fff;font-weight:bold;cursor:pointer;transition:background 0.3s;\">View More</button>
        `;
        setTimeout(() => {
          const btn = card.querySelector('.view-movie-btn');
          if (btn) {
            btn.addEventListener('click', function() {
              const movieData = {
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                popularity: movie.popularity,
                release_date: movie.release_date,
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
                poster_path: movie.poster_path,
                imgUrl: IMG_URL
              };
              localStorage.setItem('selectedMovie', JSON.stringify(movieData));
              window.location.href = 'learn2.html';
            });
          }
        }, 0);
        latestGrid.appendChild(card);
      });
    })
    .catch(() => {
      setTimeout(() => {
            showNoInternetPopup();
      }, 3000);
    });
  }

// Show no internet popup and blur everything else
function showNoInternetPopup() {
  const blur = document.getElementById('no-internet-blur');
  const popup = document.getElementById('no-internet-popup');
  if (blur && popup) {
    blur.style.display = 'block';
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

// Hide popup and blur
function hideNoInternetPopup() {
  const blur = document.getElementById('no-internet-blur');
  const popup = document.getElementById('no-internet-popup');
  if (blur && popup) {
    blur.style.display = 'none';
    popup.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Add event listeners for popup buttons after DOM loaded
document.addEventListener('DOMContentLoaded', function() {
  const exitBtn = document.querySelector('.no-internet-popup .exit-btn');
  const reloadBtn = document.querySelector('.no-internet-popup .reload-btn');
  if (exitBtn) {
    exitBtn.addEventListener('click', function() {
      hideNoInternetPopup();
    });
  }
  if (reloadBtn) {
    reloadBtn.addEventListener('click', function() {
      window.location.reload();
    });
  }
});

  // Optional: Allow pressing "Enter" in the search input to trigger search
  document.getElementById('search-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      searchMovies();
    }
  });
  document.querySelector('.search-bar button').addEventListener('click', function() {
    searchMovies();
  });
document.addEventListener('DOMContentLoaded', function() {
  const toggleMenu = document.getElementById('toggle-menu');
  const popup = document.getElementById('popup');
  if (!toggleMenu || !popup) return; // Prevent errors if elements are missing
  toggleMenu.addEventListener('click', function(e) {
    e.stopPropagation();
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', function(e) {
    if (popup.style.display === 'block' && !popup.contains(e.target) && e.target !== toggleMenu) {
      popup.style.display = 'none';
    }
  });
  document.querySelectorAll('.popup ul li a').forEach(link => {
    link.addEventListener('click', function() {
      popup.style.display = 'none';
    });
  });
});
