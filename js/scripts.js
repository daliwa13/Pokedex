// IIFE encapsulating the Pokemon repository
let pokemonRepository = (function () {
    // Pokemon data array
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    let modalContainer = document.querySelector('#modal-container');

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
        // Event listener for each button to show in console details about the pokemon on click
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
    function showDetails(item) {
        loadDetails(item).then(function () {
            showModal(item.name, item.height, item.types, item.imageUrl);
        });
    }

    function showModal(name, height, types, imageUrl) {
        // Clear all existing modal content
        modalContainer.innerHTML = '';
        // Create modal element inside the container
        let modal = document.createElement('div');
        modal.classList.add('modal');
        let closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('modal-close');
        closeButtonElement.innerText = 'X';
        closeButtonElement.addEventListener('click', hideModal);

        let titleElement = document.createElement('h1');
        titleElement.innerText = name.toUpperCase();

        let contentElement = document.createElement('p');
        contentElement.innerText = 'Height: ' + height + '\nTypes: ' + types.map(typeInfo => typeInfo.type.name).join(', ');

        let imageElement = document.createElement('img');
        imageElement.src = imageUrl;

        modal.appendChild(closeButtonElement);
        modal.appendChild(titleElement);
        modal.appendChild(imageElement);
        modal.appendChild(contentElement);
        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible');
    }

    // Function to hide the modal
    function hideModal() {
        modalContainer.classList.remove('is-visible');
    }

    // Close modal when clicking outside of it
    modalContainer.addEventListener('click', (e) => {
        let target = e.target;
        if (target === modalContainer) {
            hideModal();
        }
    });

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
})();

// Event listener for the pokeball click that creates the list of Pokemon as buttons
let pokeball = document.querySelector('.pokeball');
let firstListItem = document.querySelector('.pokemon-list :first-child');

// If statement to prevent re-adding the list on multiple clicks
if (firstListItem === null) {
    pokeball.addEventListener('click', function () {
        // Load the list of Pokemon and then add them to the page
        pokemonRepository.loadList().then(function () {
            pokemonRepository.getAll().forEach(function (pokemon) {
                pokemonRepository.addListItem(pokemon);
            });
        });
    });
} else {
    console.log('Pokemon list already loaded.');
}