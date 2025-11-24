// IIFE encapsulating the Pokemon repository
let pokemonRepository = (function () {
    // Pokemon data array
    let pokemonList = [
        { name: 'Bulbasaur', height: 2, types: ['grass', 'poison'] },
        { name: 'Charmander', height: 2, types: ['fire'] },
        { name: 'Squirtle', height: 1, types: ['water'] },
        { name: 'Caterpie', height: 6, types: ['bug'] },
        { name: 'Butterfree', height: 3, types: ['bug', 'flying'] },
        { name: 'Pidgey', height: 1, types: ['normal', 'flying'] },
        { name: 'Rattata', height: 1, types: ['normal'] },
        { name: 'Pikachu', height: 1, types: ['electric'] },
        { name: 'Jigglypuff', height: 1, types: ['normal', 'fairy'] },
        { name: 'Zubat', height: 2, types: ['poison', 'flying'] }
    ];

    // Function to get all Pokemon
    function getAll() {
        return pokemonList;
    }

    // function to add a new Pokemon
    function add(item) {
        // Validation checks for the item being added
        if (typeof item !== 'object') { //If object check
            console.error('Item is not an object!');
        } else {
            if (typeof item.name !== 'string' || typeof item.height !== 'number' || Array.isArray(item.types) === false) { // Property type checks
                console.error('Item properties are not correct!');
            } else {
                Object.keys(item).forEach(function (key) { // Property/key checks
                    if (key !== 'name' && key !== 'height' && key !== 'types') {
                        console.error('Item properties/keys are not correct!');
                    } else { // If all checks are passed, add the item
                        pokemonList.push(item);
                        console.log(item.name + ' has been added to the repository.');
                    }
                });
            }
        }
    }
    // Filter by name (max 1 result expected)
    function getPokemonByNameUsingFilter(pokemonName) {
        if (typeof pokemonName !== 'string') {
            console.error('Pokemon name must be a string!');
            return;
        } else {
            const filteredResults = pokemonRepository.getAll().filter(pokemon => pokemon.name.toUpperCase() === pokemonName.toUpperCase());
            // Log results to console
            if (filteredResults.length === 0) {
                console.log('No Pokemon found with the name: ' + pokemonName);
            } else {
                console.log('Pokemon found: ', filteredResults[0]);
            }
            // return the matching Pokemon or undefined
            return filteredResults.length > 0 ? filteredResults[0] : undefined;
        }

    }
    // Function to print Pokemon names as buttons using JS
    function addListItem(pokemon) {
        let pokemonListElement = document.querySelector('ul');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('pokemon-list-button', pokemon.types[0]);
        listItem.appendChild(button);
        pokemonListElement.appendChild(listItem);
        // Event listener for each button to show in console only name on click
        button.addEventListener('click', function () {
            showDetails(pokemon.name);
        });
    }

    // Function to show details of a Pokemon in the console
    function showDetails(pokemon) {
        console.log(pokemon);
    }

    // Return statement of the whole IIFE
    return {
        getAll: getAll,
        add: add,
        filter: getPokemonByNameUsingFilter,
        addListItem: addListItem
    };
})();

// Event listener for the pokeball click that creates the list of Pokemon as buttons
let pokeball = document.querySelector('.pokeball');
pokeball.addEventListener('click', function () {
    pokemonRepository.getAll().forEach(function (item) {
        pokemonRepository.addListItem(item);
    })
});