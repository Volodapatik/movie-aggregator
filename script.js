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

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=uk-UA`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    results.innerHTML = "";

    if (!data.results.length) {
      results.innerHTML = "Нічого не знайдено 😢";
      return;
    }

    data.results.forEach(movie => {
      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
        : "";

      results.innerHTML += `
        <div class="movie">
          ${poster ? `<img src="${poster}">` : ""}
          <h3>${movie.title}</h3>
          <p>${movie.overview || "Опис відсутній"}</p>
          <a target="_blank"
             href="https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " трейлер")}">
             ▶️ Дивитися трейлер
          </a>
        </div>
      `;
    });

  } catch (e) {
    results.innerHTML = "Помилка з'єднання";
  }
};
