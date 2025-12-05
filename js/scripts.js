// IIFE encapsulating the Pokemon repository
let pokemonRepository = (function () {
    // Pokemon data array
    let pokemonList = [];
    let modalContainer = document.querySelector('#pokemonModal');

    // function to add a new Pokemon
    function add(item) {
        if (
            typeof item === "object" &&
            "name" in item
        ) {
            pokemonList.push(item);
        } else {
            console.log("pokemon is not correct");
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
        let pokemonListElement = document.querySelector('#pokemon-list-row');
        let listItem = document.createElement('div'); // Create card div
        let cardBody = document.createElement('div'); // Create card body div
        let cardText = document.createElement('h2'); // Create h2 element
/*         let cardImg = document.createElement('img'); // Create image element */

        listItem.classList.add('card', 'pokemon-list-card');
        cardBody.classList.add('pokemon-list-button', 'card-body');
        cardText.innerText = pokemon.name[0].toUpperCase() + pokemon.name.slice(1); // Capitalize first letter
/*         cardImg.src = "https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png";
        cardImg.alt = pokemon.name + ' image'; */

        cardBody.appendChild(cardText);
/*         cardBody.appendChild(cardImg); */
        listItem.appendChild(cardBody);
        pokemonListElement.appendChild(listItem);
        // Event listener for each button to show in console details about the pokemon on click
        listItem.addEventListener('click', function () {
            showDetails(pokemon);
        });
    }

    // Function to load the list of Pokemon from the API
    function loadList(apiUrl) {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url,
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
            item.imageUrl = details.sprites.other.dream_world.front_default; //load SVG picture
            item.height = details.height; //load height
            item.types = details.types; //load types as an object
            item.weight = details.weight; //load weight
        }).catch(function (e) {
            console.error(e);
        });
    }

    // Function to show details of a Pokemon when its button is clicked
    function showDetails(item) {
        loadDetails(item).then(function () {
            showModal(item); // Load full item not just particular details
        });
    }

    function showModal(item) {
        let modalBody= $('.modal-body');
        let modalTitle= $('.modal-title');
        // Clear all existing modal content
        modalBody.empty();
        modalTitle.empty();
        // Update modal's content based on the Pokemon details
        modalTitle.text(item.name.toUpperCase()); // Add name in uppercase

        modalBody.html("<img class ='modal-img' src='" + item.imageUrl + "' alt='" + item.name + "' style='max-width: 20rem; max-height: 12rem;' /><br>"); // Add image
        modalBody.html(modalBody.html() + "<p>Height: " + item.height + "</p>") // Add height
        modalBody.html(modalBody.html() + "<p>Weight: " + item.weight + "</p>") // Add weight
        // Add types as buttons
        item.types.forEach(typeInfo => {
            let typeButton = document.createElement('button');
            typeButton.classList.add('type-button', typeInfo.type.name);
            typeButton.innerText = typeInfo.type.name.toLowerCase();
            modalBody.append(typeButton);
        });

        $("#pokemonModal").modal("show");
    }

    // Close modal when pressing the Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });

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
})(); // <-- Pokemons' IIFE ends and runs here

// Event listener for the pokeball click that creates the list of Pokemon as buttons
let pokeball = document.querySelector('.pokeball');
let instructions = document.querySelector('#instructions');
let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

pokeball.addEventListener('click', function () {
    pokeball.classList.add('disappear'); // Add the disappear class to pokeball
    instructions.classList.add('move-away'); // Add the disappear class to <h2> instructions

    pokeball.addEventListener('transitionend', function () {
        pokeball.style.display = 'none'; // Hide the pokeball after the transition
        instructions.style.display = 'none'; // Hide instructions
        pokemonRepository.loadList(apiUrl).then(function () {
            pokemonRepository.getAll().forEach(function (pokemon) {
                pokemonRepository.addListItem(pokemon);
            });
        });
    });
});