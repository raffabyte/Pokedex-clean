let offset = 0;
const limit = 30;
let pokemonDetails = [];
let renderPokemon = [];
let pokemonAllDetails = [];

let currentIndex = 0;

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
  // document.getElementById("details-container").addEventListener("click", showOverlay);

  const searchToggle = document.querySelector('.search-toggle');
  const autocompleteWrapper = document.querySelector('.autocomplete-wrapper');

  searchToggle.addEventListener('click', () => {
    if (autocompleteWrapper.style.display === 'flex') {
      autocompleteWrapper.style.display = 'none';
    } else {
      autocompleteWrapper.style.display = 'flex';
    }
  });

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

    const alreadyExists = pokemonDetails.some((p) => p.name === data.name);
    if (!alreadyExists) {
      pokemonAllDetails = [...pokemonDetails]
        .filter((v, i, a) => a.findIndex((p) => p.name === v.name) === i)
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

function chageArray() {}

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

      const alreadyExists = pokemonDetails.some(
        (p) => p.name === fullData.name
      );
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
    .filter((v, i, a) => a.findIndex((p) => p.name === v.name) === i)
    .sort((a, b) => a.id - b.id);

  console.log(renderPokemon);

  for (let index = startIndex; index < renderPokemon.length; index++) {
    const pokemonData = renderPokemon[index];
    const pokemonHtml = getPokeCardsHTML(pokemonData);

    const div = document.createElement("div");
    div.innerHTML = pokemonHtml;
    const card = div.firstElementChild;

    card.addEventListener("click", () => {
      const isMobile = window.innerWidth <= 768;
      
      currentIndex = index;
      
      if (isMobile) {
    showOverlay(pokemonData) // Für Handy
  } else {
    showPokemonDetails(pokemonData); // Für Desktop
  }

      
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
  const isMobile = window.innerWidth <= 768;
  currentIndex = pokemonDetails.findIndex(p => p.name === pokemon.name);
  
  if (isMobile) {
    showOverlay(pokemon);
  } else {
    showPokemonDetails(pokemon);
  }
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

  detailContainer.addEventListener("click", () => {
    showOverlay(pokemonData);
  });
}

function showOverlay(pokemonData) {
  const existingOverlay = document.querySelector(".pokemon-overlay");
if (existingOverlay) {
  existingOverlay.remove();
}

  const overlay = document.createElement("div");
  overlay.classList.add("pokemon-overlay");

  const modal = document.createElement("div");
  modal.classList.add("pokemon-modal");

  // hier neu


  const change = document.createElement("div");
  change.classList.add("pokemon-change");

  const previous = document.createElement("div");
  previous.classList.add("previous-pokemon");

  const next = document.createElement("div");
  next.classList.add("next-pokemon");

  const close = document.createElement("button");
close.classList.add("close-button");
close.innerHTML = getCloseHTML(); // liefert NUR das Symbol, kein Button-Element

  close.innerHTML = getCloseHTML()

  previous.innerHTML = getPreviousHTML()

  next.innerHTML = getNextHTML()


  // hier neu

  modal.innerHTML = getOverlayHTML(pokemonData)

  overlay.appendChild(modal);
  overlay.appendChild(change);
  modal.appendChild(close)
  change.appendChild(previous)
  change.appendChild(next)
  document.body.appendChild(overlay);


// hier neu

previous.addEventListener("click", () => {
  currentIndex = Math.max(0, currentIndex - 1);
  showOverlay(pokemonDetails[currentIndex]);
});

next.addEventListener("click", () => {
  currentIndex = Math.min(pokemonDetails.length - 1, currentIndex + 1);
  showOverlay(pokemonDetails[currentIndex]);
});

close.addEventListener("click", () => {
  overlay.remove(); // entfernt das Overlay aus dem DOM
  document.body.classList.remove("overlay-open"); // falls du CSS-Änderungen an <body> gemacht hast
});


// hier neu


  document.body.classList.add("overlay-open");

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
      document.body.classList.remove("overlay-open");
    }
  });

  const tabs = document.createElement("div");
tabs.classList.add("modal-tabs");
tabs.innerHTML = getOverlayHTMLTaps()
modal.appendChild(tabs);

  const contentContainer = document.createElement("div");
contentContainer.id = "modal-content";
modal.appendChild(contentContainer);

tabs.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const tab = e.target.getAttribute("data-tab");

    // 🟢 Aktive Tabs visuell markieren
    Array.from(tabs.querySelectorAll("button")).forEach(btn =>
      btn.classList.remove("active")
    );
    e.target.classList.add("active");

    // ⏩ Inhalte neu laden
    renderTab(tab, pokemonData, contentContainer);
  }
});
}

function renderTab(tab, pokemonData, container) {
  if (tab === "general") {
    container.innerHTML = getOverlayHTMLGerneral(pokemonData);
  } else if (tab === "stats") {
    container.innerHTML = getOverlayHTMLStats(pokemonData);
  } else if (tab === "abilities") {
    container.innerHTML = getOverlayHTMLAbilities(pokemonData)
  } else if (tab === "moves") {
    container.innerHTML = getOverlayHTMLMoves(pokemonData)
  }
}
