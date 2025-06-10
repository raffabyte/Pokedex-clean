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
  const height = (pokemonData.height / 10).toFixed(1); 
  const weight = (pokemonData.weight / 10).toFixed(1); 
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
    <h2 class="pokemon-name">${name}</h2>
    <p class="poke-id pokemon-id">${id}</p>
    <img class="pokemon-image" src="${imgSrc}" alt="${name}">
    <p>Typ: ${types}</p>
  `;
}
function getOverlayHTMLTaps() {
  return`
  <button data-tab="general" class="active">Allgemein</button>
  <button data-tab="stats">Status</button>
  <button data-tab="abilities">Fähigkeiten</button>
  <button data-tab="moves">Moves</button>
`;
}
function getOverlayHTMLGerneral(pokemonData) {
  return`
      <p>Größe: ${(pokemonData.height / 10).toFixed(1)} m</p>
      <p>Gewicht: ${(pokemonData.weight / 10).toFixed(1)} kg</p>
    `
}
function getOverlayHTMLStats(pokemonData) {
  const stats = pokemonData.stats.map(stat => `
      <div class="stat-row">
        <div class="stat-label">${stat.stat.name}</div>
        <div class="stat-bar">
          <div class="stat-fill" style="width: ${stat.base_stat / 2}%"></div>
        </div>
        <div class="stat-value">${stat.base_stat}</div>
      </div>
    `).join("");
  return stats
}
function getOverlayHTMLAbilities(pokemonData) {
  return pokemonData.abilities.map(a => `
      <p>${a.ability.name} ${a.is_hidden ? "(versteckt)" : ""}</p>
    `).join("");
}
function getOverlayHTMLMoves(pokemonData) {

}
function getPreviousHTML() {
  return`
      <h3>Previous</h3>
    `
}
function getNextHTML() {
  return`
      <h3>next</h3>
    `
}