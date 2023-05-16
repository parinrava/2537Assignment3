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



const setup = async () => {
  $('#pokeCards').empty();
  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
  pokemons = response.data.results;
//
  
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

 //
};
$(document).ready(setup);