// IIFE encapsulating the Pokemon repository
let pokemonRepository = (function () {
    // Pokemon data array
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=5';

    // function to add a new Pokemon
         function add(item) {
            // Validation checks for the item being added
            if (typeof item !== 'object') { //If object check
                console.error('Item is not an object!');
            } else {
                if (typeof item.name !== 'string' || typeof item.detailsUrl !== 'string') { // Property type checks
                    console.error('Item properties are not correct!');
                } else {
                    Object.keys(item).forEach(function (key) { // Key checks
                        if (key !== 'name' && key !== 'detailsUrl') {
                            console.error('Item properties/keys are not correct!');
                        } else { // If all checks are passed, add the item
                            pokemonList.push(item);
                        }
                    });
                }
            }
        }

    // Function to get all Pokemon
    function getAll() {
        return pokemonList;
    }

    // Filter by name (max 1 result expected)
    function getPokemonByNameUsingFilter(pokemonName) {
        if (typeof pokemonName !== 'string') {
            console.error('Pokemon name must be a string!');
            return;
        } else {
            const filteredResults = pokemonList.filter(pokemon => pokemon.name.toUpperCase() === pokemonName.toUpperCase());
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
        button.classList.add('pokemon-list-button');
        // Commented out due to change in source data structure
        //UPDATE LATER: Re-add type-based styling after you load types earlier in the process and as an array not an object!
        //button.classList.add('pokemon-list-button', pokemon.types[0]);
        listItem.appendChild(button);
        pokemonListElement.appendChild(listItem);
        // Event listener for each button to show in console only name on click
        button.addEventListener('click', function () {
            showDetails(pokemon);
        });
    }

    // Function to load the list of Pokemon from the API
    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        })
    }

    // Function to load details of a specific Pokemon
    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            // Assign details to the item
            item.imageUrl = details.sprites.front_default; //load picture
            item.height = details.height; //load height
            item.types = details.types; //load types as an object
        }).catch(function (e) {
            console.error(e);
        });
    }

    // Function to show details of a Pokemon when its button is clicked
    function showDetails(pokemonName) {
        loadDetails(pokemonName).then(function () {
            console.log(pokemonName);
        });
    }

    // Return statement of the whole IIFE
    return {
        getAll: getAll,
        add: add,
        filter: getPokemonByNameUsingFilter,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails
    };
})();

// Event listener for the pokeball click that creates the list of Pokemon as buttons
let pokeball = document.querySelector('.pokeball');
pokeball.addEventListener('click', function () {
    // Load the list of Pokemon and then add them to the page
    pokemonRepository.loadList().then(function () {
        pokemonRepository.getAll().forEach(function (pokemon) {
            pokemonRepository.addListItem(pokemon);
        });
    });
});