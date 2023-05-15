const setup = async () => {
  //console.log("jquery is working");

  const result = await axios.get(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=810"
  );
 //const pokemons = result.data.results;
  //slice me the first 3 pokemon
  const pokemons = result.data.results.slice(0, 10);

  pokemons.forEach(async (pokemon, index) => {
    const pokemonResult = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
   // console.log(pokemonResult);

   // extracting the name property from each type object. 
   //This creates a new array of strings containing the names of the Pokemon's types.
    const types = pokemonResult.data.types.map((type) => type.type.name)
    console.log(types)

    $("#main").append(`<div class="card" style="width: 18rem;">
        <img src="https://raw.githubusercontent.com/pokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
          index + 1
        }.png" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${pokemon.name}</h5>
          <p class="card-text"></p>
          

          <!-- Button trigger modal -->
         <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal${pokemon.name}">
         More Info
            </button>


            <!-- Modal -->
            <div class="modal fade" id="exampleModal${pokemon.name}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">${pokemon.name}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                  <h5>pokemon id: </h5>  ${pokemonResult.data.id}
                  <div style="width:200px">
                  <img src="${pokemonResult.data.sprites.other['official-artwork'].front_default}" alt="${pokemonResult.data.name}"/>
                  <div>
                  <h5>Abilities </h5>${pokemonResult.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
                  <h3>Stats</h3>
                  <ul>
                  ${pokemonResult.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
                  </div>
                  <h3>Types</h3>
                  <ul>
                 ${types.map((type) => `<li>${type}</li>`).join('')}
                  </ul>
      
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                  </div>
                </div>
              </div>
            </div>



        </div>
      </div>`);
  });
};
$(document).ready(setup);
