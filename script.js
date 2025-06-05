let offset = 0;
const limit = 30;
let pokemonDetails = [];

window.addEventListener("DOMContentLoaded", init);

async function init() {
  await loadPokemon();
  renderPokeCards();
}

async function loadPokemon() {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );
  const data = await response.json();

  for (const entry of data.results) {
    const res = await fetch(entry.url);
    const fullData = await res.json();
    pokemonDetails.push(fullData);
  }
}

function renderPokeCards() {
  const grid = document.getElementById("cards-grid");

  for (let index = 0; index < pokemonDetails.length; index++) {
    const pokemonData = pokemonDetails[index];
    const pokemonHtml = getPokeCardsHTML(pokemonData);

    const div = document.createElement("div");
    div.innerHTML = pokemonHtml;
    const card = div.firstElementChild;

    card.addEventListener("click", () => {
      showPokemonDetails(pokemonData);
    });

    grid.appendChild(card);
  }
}

function showPokemonDetails(pokemonData) {
  const detailContainer = document.getElementById("details-container");

  detailContainer.innerHTML = getDetailContainerHTML(pokemonData)


}
