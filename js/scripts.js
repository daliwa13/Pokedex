let pokemonList = [
    { name: 'Bulbasaur', height: 2, types: ['grass', 'poison']},
    { name: 'Charmander', height: 2, types: ['fire']},
    { name: 'Squirtle', height: 1, types: ['water']},
    { name: 'Caterpie', height: 6, types: ['bug']},
    { name: 'Butterfree', height: 3, types: ['bug', 'flying']},
    { name: 'Pidgey', height: 1, types: ['normal', 'flying']},
    { name: 'Rattata', height: 1, types: ['normal']},
    { name: 'Pikachu', height: 1, types: ['electric']},
    { name: 'Jigglypuff', height: 1, types: ['normal', 'fairy']},
    { name: 'Zubat', height: 2, types: ['poison', 'flying']}
]
// Printing get all Pokemon names
for (i = 0; i < pokemonList.length; i++) {
    document.write(pokemonList[i].name + ' (height: ' + pokemonList[i].height + ')');
    if (pokemonList[i].height >= 3) {
        document.write(' - This Pokemon is a big Pokemon!');
    }
    document.write('<br>');
}