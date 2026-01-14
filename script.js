const btn = document.getElementById("searchBtn");
const input = document.getElementById("searchInput");
const results = document.getElementById("results");

btn.onclick = async () => {
  const query = input.value.trim();
  if (!query) {
    alert("Введи назву фільму");
    return;
  }

  results.innerHTML = "Завантаження...";

  const searchUrl =
    `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=uk-UA`;

  const res = await fetch(searchUrl);
  const data = await res.json();

  results.innerHTML = "";

  if (!data.results.length) {
    results.innerHTML = "Нічого не знайдено 😢";
    return;
  }

  for (const movie of data.results) {
    const providers = await getFreeProviders(movie.id);

    // ❗ якщо немає безкоштовних — НЕ показуємо фільм
    if (!providers) continue;

    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
      : "";

    results.innerHTML += `
      <div class="movie">
        ${poster ? `<img src="${poster}">` : ""}
        <h3>${movie.title}</h3>
        <p>${movie.overview || "Опис відсутній"}</p>
        ${renderProviders(providers)}
      </div>
    `;
  }

  if (!results.innerHTML) {
    results.innerHTML = "Безкоштовно недоступно 😢";
  }
};

// 🔎 шукаємо ТІЛЬКИ безкоштовні сервіси
async function getFreeProviders(movieId) {
  const url =
    `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  const country = data.results?.UA || data.results?.US;
  if (!country || !country.flatrate) return null;

  return {
    link: country.link,
    providers: country.flatrate
  };
}

// 🎬 кнопки перегляду
function renderProviders(data) {
  let html = `<div class="providers"><strong>Дивитися безкоштовно:</strong><br>`;

  data.providers.forEach(p => {
    html += `
      <a target="_blank" href="${data.link}">
        ▶️ ${p.provider_name}
      </a><br>
    `;
  });

  html += `</div>`;
  return html;
}
