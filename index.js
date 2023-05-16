const PAGE_SIZE = 10;
let currentPage = 1;
let pokemons = [];
let pokemonTypes = [];

//This function updates the pagination section on the web page with the appropriate buttons based on the current
// page number and the total number of pages available.
const updatePaginationDiv = (currentPage, numPages) => {
  $('#pagination').empty();

  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(numPages, startPage + 4);

  if (currentPage > 1) {
    $('#pagination').append(`
    <button class="btn btn-primary page ml-1" id="previousButton" value="${currentPage - 1}">Previous</button>
    `);
  }

  for (let i = startPage; i <= endPage; i++) {
    const buttonClass = currentPage === i ? 'btn-primary' : 'btn-outline-primary';
    $('#pagination').append(`
    <button class="btn ${buttonClass} page ml-1" id="numberedButtons" value="${i}">${i}</button>
    `);
  }

  if (currentPage < numPages) {
    $('#pagination').append(`
    <button class="btn btn-primary page ml-1" id="nextButton" value="${currentPage + 1}">Next</button>
    `);
  }
};

//pokemon counter show
const displayPokemonCount = (totalPokemon, displayedPokemon) => {
  $('#pokemonCount').html(`
    <p>Showing ${displayedPokemon} out of ${totalPokemon} Pokémon</p>
  `);
};

//pokemon different types, the types name get to saved in the pokemonType
const fetchPokemonTypes = async () => {
  const response = await axios.get('https://pokeapi.co/api/v2/type');
  pokemonTypes = response.data.results.map((type) => type.name);
};

//filter checkbox for types, 
const createTypeFilterCheckboxes = () => {
  pokemonTypes.forEach((type) => {
    $('#typeFilter').append(`
      <div class="form-check form-check-inline">
        <input class="form-check-input typeCheckbox" type="checkbox" value="${type}" id="${type}">
        <label class="form-check-label" for="${type}">${type}</label>
      </div>
    `);
  });
};

// retrieves its associated types,checks if any of those types match the selected types, and shows or hides the card
const applyTypeFilter = async (selectedTypes) => {
  //selects all elements with the class 'pokeCard' and iterates over them using the .each()
  
  $('.pokeCard').each(function () {
    //retrieves the 'poketypes' attribute of the current card using the $(this) selector.
    //parse the attribute value into an actual array
    const cardTypes = JSON.parse($(this).attr('poketypes'));
    //checks if any of the types in the cardTypes array are included in the selectedTypes array.
    // iterate over the cardTypes array and returns true if at least one of the types matches a selected type
    const hasSelectedType = cardTypes.some((type) => selectedTypes.includes(type));

    if (hasSelectedType) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
};

const setupTypeFilterCheckboxes = () => {
  $('body').on('change', '.typeCheckbox', function () {
    const selectedTypes = $('.typeCheckbox:checked')
      .toArray()
      .map((checkbox) => checkbox.value);
    applyTypeFilter(selectedTypes);
  });
};

//displaying a subset of Pokemon cards based on the current page and page size
const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
  // extract a portion of the pokemons array based on the current page and page size
  const selectedPokemons = pokemons.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  
  //to update the display count of Pokemon cards.
  displayPokemonCount(pokemons.length, selectedPokemons.length);

  $('#pokeCards').empty();
  selectedPokemons.forEach(async (pokemon) => {
    //retrieve the detailed information for that Pokemon
    const res = await axios.get(pokemon.url);
    const types = res.data.types.map((type) => type.type.name);

    //pokeTypes attribute is set to a JSON-encoded string representing the array of Pokemon types.
    $('#pokeCards').append(`
      <div class="pokeCard card" pokeName="${res.data.name}" pokeTypes='${JSON.stringify(types)}'>
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn btn-primary " data-bs-toggle="modal" data-bs-target="#pokeModal">
          More info
        </button>
      </div>
    `);
  });
};



const setup = async () => {
  $('#pokeCards').empty();
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
  pokemons = response.data.results;
await fetchPokemonTypes();
createTypeFilterCheckboxes();
setupTypeFilterCheckboxes();

paginate(currentPage, PAGE_SIZE, pokemons);
  const numPages = Math.ceil(pokemons.length/ PAGE_SIZE);
  updatePaginationDiv(currentPage, numPages);
  
  $('body').on('click', '.pokeCard', async function (e) {
    const pokemonName = $(this).attr('pokeName');
  
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const types = res.data.types.map((type) => type.type.name);
    $('.modal-body').html(`
        <div style="width:200px">
        <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
        <div>
        <h3>Abilities</h3>
        <ul>
        ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
        </div>

        <div>
        <h3>Stats</h3>
        <ul>
        ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>

        </div>

        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join('')}
          </ul>
      
        `);
    $('.modal-title').html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `);
  });

 $('body').on('click', '#numberedButtons, #previousButton, #nextButton', async function (e) {
  currentPage = Number(e.target.value);
  paginate(currentPage, PAGE_SIZE, pokemons);
  updatePaginationDiv(currentPage, numPages);
});
};
$(document).ready(setup);