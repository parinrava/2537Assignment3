

const setup = async () =>{
    console.log("jquery is working");
   const result = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
   console.log(result.data.results)
}
$(document).ready(setup)