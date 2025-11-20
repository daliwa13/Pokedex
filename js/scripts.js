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
        if (typeof item !== 'object') {
            console.log('Item is not an object!');
        } else {
            if (typeof item.name !== 'string' || typeof item.height !== 'number' || Array.isArray(item.types) === false) {
                console.log('Item properties are not correct!');
            } else {
                pokemonList.push(item);
            }
        }
    }
    // Return statement of the whole IIFE
    return {
        getAll: getAll,
        add: add
    };
})();

// Function to print Pokemon names and height details
pokemonRepository.getAll().forEach(function (list) {
    document.write(list.name + ' (height: ' + list.height + ')');
    if (list.height >= 3) {
        document.write(' - This Pokemon is a big Pokemon!');
    }
    document.write('<br>');
});