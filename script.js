let offset = 0;
const limit = 30;

let pokemonDetails = [];

let currentIndex = 0;

let searchInput;
let ghost;
let currentSuggestion = "";

window.addEventListener("DOMContentLoaded", init);

async function init() {
  const loader = document.getElementById("grid-loader");

  loader.style.display = "flex";

  await loadMorePokemon();

  runSearchIfInput();
  toggleSearchMobile();

  loader.style.display = "none";
}

function runSearchIfInput() {
  searchInput = document.getElementById("search-input");
  ghost = document.getElementById("autocomplete-ghost");
  currentSuggestion = "";

  searchInput.addEventListener("keydown", handleAutocompleteKeydown);
  searchInput.addEventListener("input", runSearch);
}

function toggleSearchMobile() {
  const searchToggle = document.querySelector(".search-toggle");
  const autocompleteWrapper = document.querySelector(".autocomplete-wrapper");

  searchToggle.addEventListener("click", () => {
    if (autocompleteWrapper.style.display === "flex") {
      autocompleteWrapper.style.display = "none";
    } else {
      autocompleteWrapper.style.display = "flex";
    }
  });
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
    renderFilteredCards([data]);
  } catch {
    const grid = document.getElementById("cards-grid");
    grid.innerHTML = `<p style="font-size: 12px;">Kein Pokémon gefunden :(</p>`;
  }
}

async function loadMorePokemon() {
  startLoadingSpinner();

  const startIndex = pokemonDetails.length;

  await fetchMorePokemon();

  renderPokeCards(startIndex);
  endLoadingSpinner();
}

async function fetchMorePokemon() {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    const data = await response.json();

    for (const entry of data.results) {
      const res = await fetch(entry.url);
      const fullData = await res.json();

      pokemonDetails.push(fullData);
    }
  } catch (err) {
    console.error("Fehler beim Nachladen:", err);
  }

  offset += limit;
}

function startLoadingSpinner() {
  const loader = document.getElementById("grid-loader");
  const button = document.getElementById("load-more-button");

  loader.style.display = "flex";
  button.disabled = true;
  button.innerText = "Lädt...";
}

function endLoadingSpinner() {
  const loader = document.getElementById("grid-loader");
  const button = document.getElementById("load-more-button");

  loader.style.display = "none";
  button.disabled = false;
  button.innerText = "Mehr anzeigen";
}

function renderPokeCards(startIndex = 0) {
  const grid = document.getElementById("cards-grid");

  for (let index = startIndex; index < pokemonDetails.length; index++) {
    const pokemonData = pokemonDetails[index];
    const card = createPokemonCard(pokemonData, index);
    grid.appendChild(card);
  }
}

function createPokemonCard(pokemonData, index) {
  const div = document.createElement("div");
  div.innerHTML = getPokeCardsHTML(pokemonData);
  const card = div.firstElementChild;

  card.addEventListener("click", () => handleCardClick(pokemonData, index));

  return card;
}

function handleCardClick(pokemonData, index) {
  const isMobile = window.innerWidth <= 768;
  currentIndex = index;

  if (isMobile) {
    showOverlay(pokemonData);
  } else {
    showPokemonDetails(pokemonData);
  }
}

function renderFilteredCards(filteredList) {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";

  for (const pokemon of filteredList) {
    const card = createPokemonCard(pokemon);
    grid.appendChild(card);
  }
}

function createPokemonCard(pokemon) {
  const div = document.createElement("div");
  div.innerHTML = getPokeCardsHTML(pokemon);
  const card = div.firstElementChild;

  card.addEventListener("click", () => {
    currentIndex = pokemonDetails.findIndex((p) => p.name === pokemon.name);
    handleCardClick(pokemon);
  });

  return card;
}

function handleCardClick(pokemonData) {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    showOverlay(pokemonData);
  } else {
    showPokemonDetails(pokemonData);
  }
}

function formatId(id) {
  return "#" + id.toString().padStart(4, "0");
}

async function showPokemonDetails(pokemonData) {
  const detailContainer = document.getElementById("details-container");

  const evolutionNames = await loadEvolutionChain(pokemonData);
  const evolutionData = await fetchEvolutionData(evolutionNames);

  detailContainer.innerHTML = getDetailContainerHTML(
    pokemonData,
    evolutionData
  );

  const detailImg = detailContainer.querySelector(".detail-img");
  const realImg = pokemonData.sprites.other["official-artwork"].front_default;
  const loader = new Image();
  loader.src = realImg;
  loader.onload = () => {
    detailImg.src = realImg;
  };

  detailContainer.onclick = () => {
    showOverlay(pokemonData);
  };
}
async function loadEvolutionChain(pokemonData) {
  const resSpecies = await fetch(pokemonData.species.url);
  const speciesData = await resSpecies.json();
  const resEvolution = await fetch(speciesData.evolution_chain.url);
  const evolutionData = await resEvolution.json();

  const names = [];
  function extractEvolutions(evo) {
    names.push(evo.species.name);
    evo.evolves_to.forEach(extractEvolutions);
  }

  extractEvolutions(evolutionData.chain);
  return names;
}

async function fetchEvolutionData(names) {
  const evoList = [];

  for (const name of names) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const evo = await res.json();
      evoList.push({
        name: evo.name,
        img: evo.sprites.front_default,
      });
    } catch {
      evoList.push({ name, img: null });
    }
  }

  return evoList;
}

function showOverlay(pokemonData) {
  removeExistingOverlay();

  const overlay = createOverlayContainer();
  const modal = createModal(pokemonData);
  const navigation = createOverlayNavigation();
  const closeBtn = createCloseButton();

  overlay.appendChild(modal);
  overlay.appendChild(navigation);
  modal.appendChild(closeBtn);

  document.body.appendChild(overlay);
  document.body.classList.add("overlay-open");

  attachNavigationEvents(navigation, pokemonData);
  attachCloseEvents(overlay, closeBtn);

  preloadOverlayImage(modal);
  attachTabHandlers(modal, pokemonData);
}

function removeExistingOverlay() {
  const existing = document.querySelector(".pokemon-overlay");
  if (existing) existing.remove();
}

function createOverlayContainer() {
  const overlay = document.createElement("div");
  overlay.classList.add("pokemon-overlay");
  return overlay;
}

function createModal(pokemonData) {
  const modal = document.createElement("div");
  modal.classList.add("pokemon-modal");
  modal.innerHTML = getOverlayHTML(pokemonData);

  const tabs = document.createElement("div");
  tabs.classList.add("modal-tabs");
  tabs.innerHTML = getOverlayHTMLTaps();
  modal.appendChild(tabs);

  const content = document.createElement("div");
  content.id = "modal-content";
  modal.appendChild(content);

  renderTab("general", pokemonData, content);
  return modal;
}

function createOverlayNavigation() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("pokemon-change");

  const prev = document.createElement("div");
  prev.classList.add("previous-pokemon");
  prev.innerHTML = getPreviousHTML();

  const next = document.createElement("div");
  next.classList.add("next-pokemon");
  next.innerHTML = getNextHTML();

  wrapper.appendChild(prev);
  wrapper.appendChild(next);

  return wrapper;
}

function createCloseButton() {
  const btn = document.createElement("button");
  btn.classList.add("close-button");
  btn.innerHTML = getCloseHTML();
  return btn;
}

function attachNavigationEvents(navWrapper, currentData) {
  const [prev, next] = navWrapper.children;

  prev.addEventListener("click", () => {
    currentIndex = Math.max(0, currentIndex - 1);
    showOverlay(pokemonDetails[currentIndex]);
  });

  next.addEventListener("click", () => {
    currentIndex = Math.min(pokemonDetails.length - 1, currentIndex + 1);
    showOverlay(pokemonDetails[currentIndex]);
  });
}

function attachCloseEvents(overlay, closeBtn) {
  closeBtn.addEventListener("click", () => {
    overlay.remove();
    document.body.classList.remove("overlay-open");
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
      document.body.classList.remove("overlay-open");
    }
  });
}

function preloadOverlayImage(modal) {
  const image = modal.querySelector(".pokemon-image");
  const realSrc = image.getAttribute("data-src");
  const loader = new Image();
  loader.src = realSrc;
  loader.onload = () => {
    image.src = realSrc;
  };
}

function attachTabHandlers(modal, pokemonData) {
  const tabs = modal.querySelector(".modal-tabs");
  const content = modal.querySelector("#modal-content");

  tabs.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      tabs
        .querySelectorAll("button")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");

      const tab = e.target.getAttribute("data-tab");
      renderTab(tab, pokemonData, content);
    }
  });
}

function renderTab(tab, pokemonData, container) {
  if (tab === "general") {
    container.innerHTML = getOverlayHTMLGerneral(pokemonData);
  } else if (tab === "stats") {
    container.innerHTML = getOverlayHTMLStats(pokemonData);
  } else if (tab === "abilities") {
    container.innerHTML = getOverlayHTMLAbilities(pokemonData);
  } else if (tab === "moves") {
    container.innerHTML = getOverlayHTMLMoves(pokemonData);
  }
}
