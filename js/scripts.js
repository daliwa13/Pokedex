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
]

// Function to print Pokemon names and height details
function printArrayDetails(list) {
    // Printing get all Pokemon names
    for (i = 0; i < list.length; i++) {
        document.write(list[i].name + ' (height: ' + list[i].height + ')');
        if (list[i].height >= 3) {
            document.write(' - This Pokemon is a big Pokemon!');
        }
        document.write('<br>');
    }
}

printArrayDetails(pokemonList);