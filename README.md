# Pokedex
Pokedex is a simple JS web app that fetches data from public API pokeapi.co, displays them on a webpage and allows to get more information about each pokemon by opening a modal with details after clicking on name of a pokemon.
It is also possible to filter the pokemons in repository by their names. For that fill out the search form in the navigation pane.

## Tech Stack
- HTML 5
- CSS 3
- JavaScript (ES6)
- jQuery 3.3.1
- Bootstrap 4.3.1
- pokeapi.co

## HTML, CSS & JS Features Used

### HTML Elements and Structure
- Single-page structure with a responsive Bootstrap navigation bar (`navbar`, `form`, search `input`, and action `button`)
- Accessible and SEO-friendly metadata (`lang`, `meta charset`, `meta viewport`, and description meta tag)
- Dynamic content container layout using Bootstrap grid (`container`, `row`) for generated Pokémon cards
- Modal-based detail view using Bootstrap modal markup and ARIA attributes (`aria-labelledby`, `aria-hidden`, `aria-label`)
- Image and text content sections for onboarding instructions and interactive Pokéball trigger

### CSS Possibilities Implemented
- CSS custom properties (`:root` variables) for reusable color tokens
- Transforms for interactive visuals (`scale`, `rotate`, `translateY`) on Pokéball/instruction transitions
- Transitions for smooth state changes (`transition: all 2s ease`) when elements animate out
- Responsive design through media query breakpoints (e.g. max-width 575px for mobile sizing)
- Utility-style class mapping for Pokémon type styling (e.g. `.grass`, `.fire`, `.water`, etc.)

### JavaScript Features Implemented
- Module pattern with IIFE for encapsulation of repository state and methods
- Asynchronous API integration with `fetch()` and Promise chaining (`then`/`catch`)
- Dynamic DOM rendering with jQuery (card creation, event binding, modal content updates)
- Event-driven UI logic with listeners for click, submit, and transition lifecycle (`transitionend`)
- Search/filter functionality using case-insensitive partial matching (`Array.filter`, `String.includes`)
- Progressive compatibility via included Promise and Fetch polyfills

### Responsive Navigation Behavior
- Desktop view uses expanded Bootstrap navbar layout
- Smaller screens use the Bootstrap hamburger toggler with collapsible menu behavior

## Instalation
Prerequisites:
- Modern web browser (Chrome, Firefox, Edge, Safari) 
- Internet connection to fetch data from API

Download the files to a folder and open index.html in a web browser of your choice or open live version at: https://daliwa13.github.io/Pokedex

## To do
- Pagination