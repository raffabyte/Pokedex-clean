let offset = 0;
const limit = 30;
let pokemonDetails = [];
let renderPokemon = []
let pokemonAllDetails = [];

let searchInput;
let ghost;
let currentSuggestion = "";

window.addEventListener("DOMContentLoaded", init);

async function init() {
  const loader = document.getElementById("grid-loader");
  loader.style.display = "flex";

  await loadMorePokemon();
  renderPokeCards();

  searchInput = document.getElementById("search-input");
  ghost = document.getElementById("autocomplete-ghost");
  currentSuggestion = "";

  searchInput.addEventListener("keydown", handleAutocompleteKeydown);
  searchInput.addEventListener("input", runSearch);

  loader.style.display = "none";
}

async function runSearch() {
  const search = searchInput.value.trim().toLowerCase();

  if (search === "") {
    renderPokemon = [...pokemonDetails].sort((a, b) => a.id - b.id);
    renderFilteredCards(renderPokemon);
    ghost.textContent = "";
    currentSuggestion = "";
    return;
  }

  ghostSuggestion(search);
  const foundLocally = searchPokemon(search);
if (!foundLocally) {
  searchExactPokemon(search);
}
}

function ghostSuggestion(search) {
  const suggestion = pokemonDetails.find((p) => p.name.startsWith(search));
  if (suggestion) {
    ghost.textContent = suggestion.name;
    currentSuggestion = suggestion.name;
  } else {
    ghost.textContent = "";
    currentSuggestion = "";
  }
}

function handleAutocompleteKeydown(event) {
  if ((event.key === "Enter" || event.key === "Tab") && currentSuggestion) {
    event.preventDefault();
    searchInput.value = currentSuggestion;
    ghost.textContent = "";
    currentSuggestion = "";
    runSearch();
  }
}

function searchPokemon(search) {
  const partialMatches = pokemonDetails.filter(
    (pokemon) =>
      pokemon.name.includes(search) ||
      pokemon.types.some((t) => t.type.name.includes(search))
  );

  if (partialMatches.length > 0) {
    renderFilteredCards(partialMatches);
    return true;
  } else {
    return false;
  }
}

async function searchExactPokemon(search) {
  if (search.length < 2) return;

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search}`);
    if (!res.ok) throw new Error("not found");

    const data = await res.json();

    const alreadyExists = pokemonDetails.some(p => p.name === data.name);
    if (!alreadyExists) {

      pokemonAllDetails = [...pokemonDetails]
    .filter((v, i, a) => a.findIndex(p => p.name === v.name) === i) 
    .sort((a, b) => a.id - b.id);

      pokemonAllDetails.push(data);
      pokemonAllDetails.sort((a, b) => a.id - b.id);
    }

    renderFilteredCards([data]);
  } catch {
    const grid = document.getElementById("cards-grid");
    grid.innerHTML = `<p style="font-size: 12px;">Kein Pokémon gefunden :(</p>`;
  }
}

function chageArray() {

}

async function loadMorePokemon() {
  const loader = document.getElementById("grid-loader");
  const button = document.getElementById("load-more-button");

  loader.style.display = "flex";
  button.disabled = true;
  button.innerText = "Lädt...";

  const startIndex = pokemonDetails.length;

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    const data = await response.json();

    for (const entry of data.results) {
      const res = await fetch(entry.url);
      const fullData = await res.json();

      const alreadyExists = pokemonDetails.some(p => p.name === fullData.name);
      if (!alreadyExists) {
        pokemonDetails.push(fullData);
      }

      
    }

    offset += limit;
    pokemonDetails.sort((a, b) => a.id - b.id);
    renderPokeCards(startIndex);
  } catch (err) {
    console.error("Fehler beim Nachladen:", err);
  }

  loader.style.display = "none";
  button.disabled = false;
  button.innerText = "Mehr anzeigen";
}

function renderPokeCards(startIndex = 0) {
  const grid = document.getElementById("cards-grid");
   renderPokemon = [...pokemonDetails]
    .filter((v, i, a) => a.findIndex(p => p.name === v.name) === i) 
    .sort((a, b) => a.id - b.id);

    console.log(renderPokemon);
    

  for (let index = startIndex; index < renderPokemon.length; index++) {
    const pokemonData = renderPokemon[index];
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

function renderFilteredCards(filteredList) {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";

  for (const pokemon of filteredList) {
    const html = getPokeCardsHTML(pokemon);
    const div = document.createElement("div");
    div.innerHTML = html;
    const card = div.firstElementChild;

    card.addEventListener("click", () => {
      showPokemonDetails(pokemon);
    });

    grid.appendChild(card);
  }
}

function formatId(id) {
  return "#" + id.toString().padStart(4, "0");
}

function showPokemonDetails(pokemonData) {
  const detailContainer = document.getElementById("details-container");

  detailContainer.innerHTML = getDetailContainerHTML(pokemonData);

  const detailImg = detailContainer.querySelector(".detail-img");
  const realImg = pokemonData.sprites.other["official-artwork"].front_default;

  const loader = new Image();
  loader.src = realImg;
  loader.onload = () => {
    detailImg.src = realImg;
  };
}
