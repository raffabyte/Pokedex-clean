function getPokeCardsHTML(pokemonData) {
  const idFormatted = formatId(pokemonData.id);

  const typesHTML = pokemonData.types
    .map(
      (t) =>
        `<span class="type-badge ${
          t.type.name
        }">${t.type.name.toUpperCase()}</span>`
    )
    .join(" ");

  return `
    <div class="poke-card">
      <h3>${pokemonData.name.toUpperCase()}</h3>
      <p class="poke-id">${idFormatted}</p>
      <img class="poke-img" src="${pokemonData.sprites.front_default}" alt="${
    pokemonData.name
  }">
      <div class="types">${typesHTML}</div>
    </div>
  `;
}

function getDetailContainerHTML(pokemonData, evolutionData) {
  const realImg = pokemonData.sprites.other["official-artwork"].front_default;
  const placeholder = "img/pokeball.png";
  const idFormatted = formatId(pokemonData.id);

  const typesHTML = pokemonData.types
    .map(
      (t) =>
        `<span class="type-badge ${
          t.type.name
        }">${t.type.name.toUpperCase()}</span>`
    )
    .join(" ");

  const abilitiesHTML = pokemonData.abilities
    .map((a) => `${a.ability.name}${a.is_hidden ? " (hidden)" : ""}`)
    .join(", ");

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

  const evoHTML = evolutionData
    .map((evo) => {
      if (!evo.img) {
        return `<p>${evo.name}</p>`;
      }
      return `
      <div>
      <img src="${evo.img}"
      <p>${evo.name.toUpperCase()}</p>
    </div>
    `;
    })
    .join("");

  return `
    <h2>${pokemonData.name.toUpperCase()}</h2>
    <p class="poke-id">${idFormatted}</p>
    <img class="detail-img" src="${placeholder}" data-src="${realImg}" width="200">
    <div>${typesHTML}</div>
    <hr>
    <p><strong>Size:</strong> ${(pokemonData.height / 10).toFixed(1)} m</p>
    <p><strong>Weight:</strong> ${(pokemonData.weight / 10).toFixed(1)} kg</p>
    <p><strong>Abilities:</strong> ${abilitiesHTML}</p>
    <p><strong>Base XP:</strong> ${pokemonData.base_experience}</p>
    <hr>
    <h3>Stats</h3>
    ${statsHTML}
    <hr>
    <h3>Evolution</h3>
    <div>${evoHTML}</div>
  `;
}

function getOverlayHTML(pokemonData) {
  const imgSrc = pokemonData.sprites.other["official-artwork"].front_default;
  const name = pokemonData.name.toUpperCase();
  const id = formatId(pokemonData.id);
  const types = pokemonData.types
    .map((t) => `<span class="type-badge ${t.type.name}">${t.type.name}</span>`)
    .join(" ");

  return `
    <h2 class="pokemon-name">${name}</h2>
    <p class="poke-id pokemon-id">${id}</p>
    <img class="pokemon-image" src="img/pokeball.png" data-src="${imgSrc}" alt="${name}">
    <p>Typ: ${types}</p>
  `;
}

function getOverlayHTMLTaps() {
  return `
    <button data-tab="general" class="active">Allgemein</button>
    <button data-tab="stats">Status</button>
    <button data-tab="abilities">Fähigkeiten</button>
    <button data-tab="moves">Moves</button>
  `;
}

function getOverlayHTMLGerneral(pokemonData) {
  return `
    <p><strong>Size:</strong> ${(pokemonData.height / 10).toFixed(1)} m</p>
    <p><strong>Weight:</strong> ${(pokemonData.weight / 10).toFixed(1)} kg</p>
  `;
}

function getOverlayHTMLStats(pokemonData) {
  return pokemonData.stats
    .map(
      (stat) => `
    <div class="stat-row">
      <div class="stat-label">${stat.stat.name}</div>
      <div class="stat-bar">
        <div class="stat-fill" style="width: ${stat.base_stat / 2}%"></div>
      </div>
      <div class="stat-value">${stat.base_stat}</div>
    </div>
  `
    )
    .join("");
}

function getOverlayHTMLAbilities(pokemonData) {
  return pokemonData.abilities
    .map(
      (a) => `
    <p>${a.ability.name}${a.is_hidden ? " (hidden)" : ""}</p>
  `
    )
    .join("");
}

function getOverlayHTMLMoves(pokemonData) {
  const moves = pokemonData.moves
    .slice(0, 10)
    .map((m) => m.move.name)
    .join(", ");
  return `<p>${moves}</p>`;
}

function getPreviousHTML() {
  return `<h3>Previous</h3>`;
}

function getNextHTML() {
  return `<h3>Next</h3>`;
}

function getCloseHTML() {
  return `✖`;
}
