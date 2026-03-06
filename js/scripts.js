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
        // let cardBody = $('<div></div>'); // Create card body div
        let cardText = $('<h2></h2>'); // Create h2 element

        listItem.addClass('card pokemon-list-card');
        cardText.addClass('pokemon-list-name');
        cardText.text(pokemon.name[0].toUpperCase() + pokemon.name.slice(1)); // Capitalize first letter

        // cardBody.append(cardText);
        listItem.append(cardText);
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
            item.stats = details.stats; //load stats
        }).catch(function (e) {
            console.error(e);
            throw e; // Rethrow the error to be handled in the calling function
        });
    }

    // Function to show details of a Pokemon when its button is clicked
    function showDetails(item) {
        tempModal(item); // Show temporary modal with spinner while loading details
        
        loadDetails(item).then(function () {
            showModal(item); // Load full item not just particular details
        })
        .catch(function () {
            $('.modal-body').html('<p>Failed to load Pokemon details.</p>');
        });
    }

    function tempModal(item) {
        let modalTitle = $('.modal-title');
        // Add name in uppercase to the modal title
        modalTitle.text(item.name.toUpperCase());
        // Add spinner to the modal body while loading details
        showSpinner('.modal-body', 'modal-spinner', 'Loading Pokemon details...', true);

        $('#pokemonModal').modal('show');
    }

    function showModal(item) {
        let modalBody = $('.modal-body');
        let modalTitle = $('.modal-title');
        // Clear all existing modal content
        if (modalTitle.text() !== item.name.toUpperCase()) {
            modalTitle.empty();
        }
        if (modalBody.id !== 'modal-spinner') {
            modalBody.empty();
        }
        
        // Update modal's content based on the Pokemon details
        modalTitle.text(item.name.toUpperCase()); // Add name in uppercase
        // Add image to the modal body with spinner while loading the image
        let imageWrapper = $('<div class="image-wrapper"></div>');
        modalBody.append(imageWrapper);
        showSpinner('.image-wrapper', 'modal-image-spinner', 'Loading Pokemon image...', true); // Show spinner while loading image
        let modalIMG = $('<img>')
            .addClass('modal-img')
            .attr('alt', item.name)
            .css('display', 'none'); // Hide the image until it's fully loaded;
        
        modalIMG.on('load', function () {
            hideSpinner('#modal-image-spinner'); // Hide the spinner once the image is loaded
            $(this).css('display', ''); // Show the image after it's loaded
        })
        modalIMG.on('error', function () {
            hideSpinner('.image-wrapper', 'modal-image');
            imageWrapper.append('<p>Image unavailable</p>');
        });
        imageWrapper.append(modalIMG); // Add image 
        modalIMG.attr('src', item.imageUrl);
        
        
        modalBody.append('<br><p>Height: ' + item.height * 10 + ' cm</p>'); // Add height
        modalBody.append('<p>Weight: ' + item.weight / 10 + ' kg</p>'); // Add weight
        // Add types as buttons
        modalBody.append('<h4>Types:</h4>');
        item.types.forEach(typeInfo => { // Loop through types array to create buttons for each type
            let typeButton = $('<button></button>');
            typeButton.addClass('type-button ' + typeInfo.type.name);
            typeButton.text(typeInfo.type.name.toLowerCase());
            modalBody.append(typeButton);
        });

        // Add stats
        modalBody.append('<h4>Stats:</h4>');
        let table = $('<table class="table"></table>');
        let stats = item.stats;
        stats.forEach(statInfo => { // Loop through stats array to create a table row for each stat
            let statName = statInfo.stat.name.toUpperCase();
            let statValue = statInfo.base_stat;
            let statsBar = $('<div class="stats-bar"></div>').css('width', 170 + 'px').css('height', '20px'); // Set a fixed width and height for the bar
            statsBar.css('background', 'linear-gradient(to right, var(--red) 0%, var(--red) ' + statValue + '%, #e9ecef ' + statValue + '%, #e9ecef 100%)'); // Create stat bar with gradient based on stat value
            let tr = $('<tr></tr>');
            let th = $('<th></th>').text(statName); // Create table header (1st column in each row) for stat name
            let tdBar = $('<td></td>').addClass('td-bar').append(statsBar); // Add stats bar to the table cell
            let tdValue = $('<td></td>').text(statValue); // Create table cell for stat value
            tr.append(th, tdBar, tdValue);
            table.append(tr);
        });

        modalBody.append(table);
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
})(); // <-- Pokemons' IIFE ends and runs here

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
        showSpinner('#pokemon-list-row', 'pokemon-list-spinner', 'Loading pokemon list...'); // Show the spinner while loading the Pokemon list
        pokemonRepository.loadList(apiUrl)
            .then(function () {
                // clear row if needed
                pokemonRepository.getAll().forEach(function (pokemon) {
                    pokemonRepository.addListItem(pokemon);
                });
            })
            .catch(function () {
                // show error UI
            })
            .finally(function () {
                hideSpinner('#pokemon-list-spinner'); // Hide the spinner after loading is complete
        });
    });
});


// Show spinner function
function showSpinner(targetSelector, spinnerKey, label, clearTarget) {
    let spinnerTarget = document.querySelector(targetSelector);
    if (!spinnerTarget) {
        console.error('Spinner target element not found!');
        return;
    }
    if (clearTarget) {
        spinnerTarget.innerHTML = ''; // Clear the target element if clearTarget is true
    }
    let spinnerContainer = document.createElement('div'); // Create a container for the spinner
    let spinnerElement = document.createElement('div'); // Create the spinner element
    let spinnerText = document.createElement('span'); // Create a span for screen reader text

    spinnerContainer.className = 'd-flex justify-content-center align-items-center py-4';
    spinnerContainer.setAttribute('id', spinnerKey); // Set an ID for the spinner element so it can be easily removed later
    spinnerElement.className = 'spinner-border text-danger';
    spinnerElement.setAttribute('role', 'status');
    spinnerElement.setAttribute('aria-live', 'polite');
    spinnerElement.setAttribute('aria-label', label);

    spinnerText.className = 'sr-only';
    spinnerText.textContent = label;

    spinnerElement.appendChild(spinnerText); // Add the screen reader text to the spinner element
    spinnerContainer.appendChild(spinnerElement); // Add the spinner element to the container
    spinnerTarget.appendChild(spinnerContainer); // Add the spinner container to the target element
}

// Hide spinner function
function hideSpinner(spinnerKey) {
    let spinnerContainer = document.querySelector(spinnerKey);
    if (spinnerContainer) {
        spinnerContainer.remove(); // Remove the spinner from the DOM
    } else {
        console.warn('Spinner container #' + spinnerKey + ' not found!');
    }
}

// Function to add a reload button after search results are displayed
function appendReloadButton() {
    let pokemonListContainer = document.querySelector('#pokemon-list-container');
    let pokemonListRow = document.querySelector('#pokemon-list-row');
    let existing = document.querySelector('#reload-button');
    if (existing) {
        existing.remove();
    }

    let reloadButton = document.createElement('button');
    reloadButton.id = 'reload-button';
    reloadButton.className = 'btn btn-danger mt-3';
    reloadButton.textContent = 'Reload pokemon list';
    reloadButton.addEventListener('click', function () {
        pokemonListRow.innerHTML = '';
        pokemonRepository.loadList(apiUrl).then(function () {
            pokemonRepository.getAll().forEach(function (pokemon) {
                pokemonRepository.addListItem(pokemon);
            });
        });
        let searchInput = document.querySelector('#search-input');
        searchInput.value = ''; // Clear the search input field
    });

    pokemonListContainer.appendChild(reloadButton);
}

// Function to handle search form submission
function handleSearch(event) {
    event.preventDefault(); // Prevent page reload on submit or Enter
    let searchInput = document.querySelector('#search-input').value.toLowerCase();
    let filteredPokemon = pokemonRepository.filter(searchInput);
    let pokemonListRow = document.querySelector('#pokemon-list-row');
    pokemonListRow.innerHTML = ''; // Clear existing Pokemon cards

    if (filteredPokemon.length === 0) {
        let noResults = document.createElement('p');
        let numberOfPokemon = apiUrl.split('=')[1]; // Extract the number of Pokemon from the API URL for use in the no results message
        noResults.textContent = 'No Pokemon with that name has been found in this Pokedex, which contains ' + numberOfPokemon + ' Pokemons.';
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