

const setup = async () =>{
    console.log("jquery is working");
   const result = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
  const pokemons = result.data.results;
  pokemons.forEach(pokemon => 
    {
    $("#main").append(`<div class="pokemon">${pokemon.name}</div>`);
  });
}
$(document).ready(setup)