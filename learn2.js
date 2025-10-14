// On page load, get movie data from localStorage and display it
window.addEventListener('DOMContentLoaded', function() {
  const detailsCard = document.getElementById('movie-details-card');
  const movieData = localStorage.getItem('selectedMovie');
  if (!movieData) {
    detailsCard.innerHTML = '<p>No movie data found.</p>';
    return;
  }
  const movie = JSON.parse(movieData);
  detailsCard.innerHTML = `
    <img src="${movie.poster_path ? movie.imgUrl + movie.poster_path : 'https://via.placeholder.com/220x330?text=No+Image'}" alt="${movie.title}" class="details-poster">
    <h2>${movie.title}</h2>
    <p><strong>Overview:</strong> ${movie.overview || 'No overview available.'}</p>
    <p><strong>Popularity:</strong> ${movie.popularity || 'N/A'}</p>
    <p><strong>Release Date:</strong> ${movie.release_date || 'N/A'}</p>
    <p><strong>Vote Average:</strong> ${movie.vote_average || 'N/A'}</p>
    <p><strong>Vote Count:</strong> ${movie.vote_count || 'N/A'}</p>
    <hr>
    <div id="watch-providers"></div>
  `;

  // Fetch watch providers from TMDb
  if (movie.id) {
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=53d6fa6cdd2204b65da66171ef667b2a`)
      .then(res => res.json())
      .then(data => {
        const providersDiv = document.getElementById('watch-providers');
        let providers = null;
        // Try NG (Nigeria), fallback to US, fallback to any available
        if (data.results && data.results.NG) providers = data.results.NG;
        else if (data.results && data.results.US) providers = data.results.US;
        else if (data.results) providers = Object.values(data.results)[0];
        if (providers && providers.flatrate && providers.flatrate.length > 0) {
          let html = '<div style="margin-top:18px;"><strong>Available on:</strong></div><div style="display:flex;flex-wrap:wrap;gap:18px;margin-top:10px;">';
          providers.flatrate.forEach(service => {
            // TMDb provides logo_path for each provider
            const logoUrl = service.logo_path ? `https://image.tmdb.org/t/p/w45${service.logo_path}` : '';
            html += `<a href="${providers.link}" target="_blank" style="display:flex;flex-direction:column;align-items:center;text-decoration:none;">
              <img src="${logoUrl}" alt="${service.provider_name}" style="width:45px;height:45px;object-fit:contain;margin-bottom:6px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.12);">
              <span style="color:#fff;font-size:0.95em;font-weight:bold;">${service.provider_name}</span>
            </a>`;
          });
          html += '</div>';
          providersDiv.innerHTML = html;
        } else if (providers && providers.link) {
          providersDiv.innerHTML = `<a href="${providers.link}" target="_blank" class="watch-btn">Watch Online</a>`;
        } else {
          providersDiv.innerHTML = '<p style="margin-top:16px;color:white;">No streaming provider link found.</p>';
        }
      })
      .catch(() => {
        const providersDiv = document.getElementById('watch-providers');
        providersDiv.innerHTML = '<p style="margin-top:16px;color:#ccc;">Could not load streaming info.</p>';
      });
  }
});
