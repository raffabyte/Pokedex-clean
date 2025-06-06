let offset = 0;
const limit = 30;
let pokemonDetails = [];

window.addEventListener("DOMContentLoaded", init);

async function init() {
  const loader = document.getElementById("grid-loader");
  loader.style.display = "flex"; // ✅ Spinner zeigen

  await loadPokemon();
  renderPokeCards(0);

  loader.style.display = "none"; // ✅ Spinner ausblenden
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

function renderPokeCards(startIndex = 0) {
  const grid = document.getElementById("cards-grid");

  for (let index = startIndex; index < pokemonDetails.length; index++) {
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

async function loadMorePokemon() {
  const loader = document.getElementById("grid-loader");
  const button = document.getElementById("load-more-button");

  loader.style.display = "flex";
  button.disabled = true;
  button.innerText = "Lädt...";

  const startIndex = pokemonDetails.length;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();

    for (const entry of data.results) {
      const res = await fetch(entry.url);
      const fullData = await res.json();
      pokemonDetails.push(fullData);
    }

    offset += limit;
    renderPokeCards(startIndex); // 👈 Nur neue Karten
  } catch (err) {
    console.error("Fehler beim Nachladen:", err);
  }

  loader.style.display = "none";
  button.disabled = false;
  button.innerText = "Mehr anzeigen";
}

function showPokemonDetails(pokemonData) {
  const detailContainer = document.getElementById("details-container");

  detailContainer.innerHTML = getDetailContainerHTML(pokemonData)

  const detailImg = detailContainer.querySelector(".detail-img");
  const realImg = pokemonData.sprites.other["official-artwork"].front_default;

  const loader = new Image();
  loader.src = realImg;
  loader.onload = () => {
    detailImg.src = realImg;
  };
}
