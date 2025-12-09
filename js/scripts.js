// IIFE encapsulating the Pokemon repository
let pokemonRepository = (function () {
    // Pokemon data array
    let pokemonList = [];

    // function to add a new Pokemon
    function add(item) {
        if (
            typeof item === 'object' &&
            'name' in item
        ) {
            pokemonList.push(item);
        } else {
            console.log('pokemon is not correct');
        }
    }

    // Function to get all Pokemon
    function getAll() {
        return pokemonList;
    }

    // Filter by name (partial, case-insensitive)
    function getPokemonByNameUsingFilter(pokemonName) {
        if (typeof pokemonName !== 'string') {
            console.error('Pokemon name must be a string!');
            return [];
        }

        const normalizedSearch = pokemonName.trim().toLowerCase();
        if (!normalizedSearch) {
            return pokemonList; // empty input returns all
        }

        return pokemonList.filter(pokemon =>
            pokemon.name.toLowerCase().includes(normalizedSearch)
        );
    }

        // Function to print Pokemon names as buttons using jQuerry
        function addListItem(pokemon) {
            let pokemonListElement = $('#pokemon-list-row');
            let listItem = $('<div></div>'); // Create card div
            let cardBody = $('<div></div>'); // Create card body div
            let cardText = $('<h2></h2>'); // Create h2 element

            listItem.addClass('card', 'pokemon-list-card');
            cardBody.addClass('pokemon-list-button', 'card-body');
            cardText.text(pokemon.name[0].toUpperCase() + pokemon.name.slice(1)); // Capitalize first letter

            cardBody.append(cardText);
            listItem.append(cardBody);
            pokemonListElement.append(listItem);
            // Event listener for each button to show in console details about the pokemon on click
            listItem.on('click', function () {
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
            let modalBody = $('.modal-body');
            let modalTitle = $('.modal-title');
            let modalIMG = $('<img>');
            // Clear all existing modal content
            modalBody.empty();
            modalTitle.empty();
            // Update modal's content based on the Pokemon details
            modalTitle.text(item.name.toUpperCase()); // Add name in uppercase
            modalIMG = $('<img>').addClass('modal-img').attr('src', item.imageUrl).attr('alt', item.name);
            modalBody.append(modalIMG); // Add image
            modalBody.append('<br><p>Height: ' + item.height + '</p>'); // Add height
            modalBody.append('<p>Weight: ' + item.weight + '</p>'); // Add weight
            // Add types as buttons
            item.types.forEach(typeInfo => {
                let typeButton = $('<button></button>');
                typeButton.addClass('type-button ' + typeInfo.type.name);
                typeButton.text(typeInfo.type.name.toLowerCase());
                modalBody.append(typeButton);
            });

            $('#pokemonModal').modal('show');
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
    }) (); // <-- Pokemons' IIFE ends and runs here

    // Event listener for the pokeball click that creates the list of Pokemon as cards
    let pokeball = document.querySelector('.pokeball');
    let instructions = document.querySelector('#instructions');
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    let searchForm = document.querySelector('#search-form');
    let searchButton = document.querySelector('#search-input-btn');

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

    function appendReloadButton() {
        let pokemonListRow = document.querySelector('#pokemon-list-row');
        let existing = document.querySelector('#reload-button');
        if (existing) {
            existing.remove();
        }

        let reloadButton = document.createElement('button');
        reloadButton.id = 'reload-button';
        reloadButton.className = 'btn btn-outline-danger mt-3';
        reloadButton.textContent = 'Reload pokemon list';
        reloadButton.addEventListener('click', function () {
            pokemonListRow.innerHTML = '';
            pokemonRepository.loadList(apiUrl).then(function () {
                pokemonRepository.getAll().forEach(function (pokemon) {
                    pokemonRepository.addListItem(pokemon);
                });
            });
        });

        pokemonListRow.appendChild(reloadButton);
    }

    function handleSearch(event) {
        event.preventDefault(); // Prevent page reload on submit or Enter
        let searchInput = document.querySelector('#search-input').value.toLowerCase();
        let filteredPokemon = pokemonRepository.filter(searchInput);
        let pokemonListRow = document.querySelector('#pokemon-list-row');
        pokemonListRow.innerHTML = ''; // Clear existing Pokemon cards

        if (filteredPokemon.length === 0) {
            let noResults = document.createElement('p');
            noResults.textContent = 'No Pokemon with that name has been found';
            pokemonListRow.appendChild(noResults);
            appendReloadButton();
            return;
        }

        filteredPokemon.forEach(function (pokemon) {
            pokemonRepository.addListItem(pokemon);
        });
        appendReloadButton();
    }

    searchForm.addEventListener('submit', handleSearch);
    searchButton.addEventListener('click', handleSearch);