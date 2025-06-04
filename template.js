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
