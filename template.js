function getPokeCardsHTML(pokemonData) {
  const idFormatted = formatId(pokemonData.id);

  const typesHTML = pokemonData.types
    .map((t) => {
      const name = t.type.name;
      return `<span class="type-badge ${name}">${name.toUpperCase()}</span>`;
    })
    .join(" ");

  return `
    <div class="poke-card">
      <h3>${pokemonData.name.toUpperCase()}</h3>
      <p class="poke-id">${idFormatted}</p>
      <img class="poke-img" src="${pokemonData.sprites.front_default}">
      <div class="types">${typesHTML}</div>
    </div>
  `;
}

function getDetailContainerHTML(pokemonData) {
  const realImg = pokemonData.sprites.other["official-artwork"].front_default;
  const placeholder = "img/pokeball.png";
  const idFormatted = formatId(pokemonData.id);
  
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
    <p class="poke-id">${idFormatted}</p>
    <img class="detail-img" src="${placeholder}" data-src="${realImg}" width="200">
    <div>${typesHTML}</div>
    <hr>
    <h3>Stats</h3>
    ${statsHTML}
    <hr>
  `;
}

function getOverlayHTML(pokemonData) {
  const imgSrc = pokemonData.sprites.other["official-artwork"].front_default;
  const name = pokemonData.name.toUpperCase();
  const id = formatId(pokemonData.id);
  const height = (pokemonData.height / 10).toFixed(1); // in Metern
  const weight = (pokemonData.weight / 10).toFixed(1); // in kg
  const types = pokemonData.types
  .map((t) => `<span class="type-badge ${t.type.name}">${t.type.name}</span>`)
  .join(" ");
  
  const stats = pokemonData.stats
    .map((stat) => {
      return `
      <div class="stat-row">
        <div class="stat-label">${stat.stat.name}</div>
        <div class="stat-bar">
          <div class="stat-fill" style="width: ${stat.base_stat / 2}%"></div>
        </div>
        <div class="stat-value">${stat.base_stat}</div>
      </div>
    `;
    })
    .join("");

    return `
    <h2>${name} <span style="font-size: 0.6rem; color: #666;">${id}</span></h2>
    <img src="${imgSrc}" alt="${name}">
    <p>Typ: ${types}</p>
    <p>Größe: ${height} m</p>
    <p>Gewicht: ${weight} kg</p>
    <div>${stats}</div>
  `;
}