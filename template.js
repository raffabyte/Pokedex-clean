function getPokeCardsHTML(pokemonData) {
  const typesHTML = pokemonData.types
    .map((t) => {
      const name = t.type.name;
      return `<span class="type-badge ${name}">${name.toUpperCase()}</span>`;
    })
    .join(" ");

  return `
    <div class="poke-card">
      <h3>${pokemonData.name.toUpperCase()}</h3>
      <img class="poke-img" src="${pokemonData.sprites.front_default}">
      <div class="types">${typesHTML}</div>
    </div>
  `;
}

function getDetailContainerHTML(pokemonData) {
  const realImg = pokemonData.sprites.other["official-artwork"].front_default;
  const placeholder = "img/pokeball.png";
  
  const typesHTML = pokemonData.types
    .map((t) => `<span class="type-badge ${t.type.name}">${t.type.name}</span>`)
    .join(" ");

  const statsHTML = pokemonData.stats
    .map(
      (s) => `
      <div class="stat-row">
        <span class="stat-label">${s.stat.name.toUpperCase()}</span>
        <div class="stat-bar">
          <div class="stat-fill" style="width: ${
            Math.min(s.base_stat, 150) / 1.5
          }%"></div>
        </div>
        <span class="stat-value">${s.base_stat}</span>
      </div>
    `
    )
    .join("");

  return `
    <h2>${pokemonData.name.toUpperCase()}</h2>
    <img class="detail-img" src="${placeholder}" data-src="${realImg}" width="200">
    <div>${typesHTML}</div>
    <hr>
    <h3>Stats</h3>
    ${statsHTML}
    <hr>
  `;
}
